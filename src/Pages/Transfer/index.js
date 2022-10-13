import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner, Text, Input } from "@chakra-ui/react";
import { CopyIcon,ChevronLeftIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";

import CheckIcon from "../../assets/icons/check.svg";
import { useAppDispatch } from "../../store";
import { useBlockNative } from "../../Providers/Web3.provider";
import {
  formatAddress,
  postMessageToListeners,
  toEther,
  getLatestTransactions,
  getLatestTokenTransactions,
} from "../../utils/helpers";
import { stableCoinToAddress, tokenMeta } from "../../utils/constants";
import { selectNetwork } from "../../reducers/network/selector";
import { selectWallet } from "../../reducers/wallet/selector";
import { ERC20ContractFactory } from "../../utils/contract/index";
import {
  fetchUSDPriceOfNativeToken,
} from "../../reducers/transaction/transactionSlice";
import {
  selectTokenTransaction,
  selectTranction,
} from "../../reducers/transaction/selector";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Box,
  Progress,
} from "@chakra-ui/react";
import { chainConfig } from "../../config/chain";

export default function Transfer() {
  const { connected } = useBlockNative();

  const networkState = useSelector(selectNetwork);
  const walletState = useSelector(selectWallet);
  const tokenTransactionState = useSelector(selectTokenTransaction);
  const transactionState = useSelector(selectTranction);
  const dispatch = useAppDispatch();

  const { NETWORK_NAME, NETWORK_ID, CURRENCY_SYMBOL, CHAIN_ID } = networkState;
  // const { address } = walletState;
  const {
    RECEPIENT,
    ACCEPTING_TOKENS,
    TOKENS_PAYMENT_CONFIG,
    COIN_PRICE_USD,
    VALUE,
    ACCEPTING_TRANSFER
  } = transactionState;

  const [loading, setLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokens, setTokenData] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [countdownId, setCountdownId] = useState(null);
  const [error, setError] = useState(null);
  const [nativeToken, setNativeToken] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [transferConfirmed, setTransferConfirmed] = useState(false);
  const [confirmedAddress, setConfirmedAddress] = useState(false);
  const [transferFrom, setTransferFrom] = useState("");
  const [isVerifyingAddress, setIsVerifyingAddress] = useState(false);
  const [block, setBlock] = useState(null);
  const [confirmInfo, setConfirmInfo] = useState(null);

  useEffect(() => {
    if (timeLeft === 0) {
      window.clearInterval(countdownId);
      closeBondPay(true, "script");
    }
  }, [timeLeft]);

  useEffect(() => {
    if (loading && NETWORK_ID && ACCEPTING_TOKENS) {
      init(TOKENS_PAYMENT_CONFIG.CONFIG, NETWORK_ID);
    }
  }, [connected, networkState, walletState, loading, NETWORK_ID]);

  useEffect(() => {
    selectedToken && confirmedAddress && startListening(selectedToken);
  }, [selectedToken, confirmedAddress]);

  async function init(TOKENS_PAYMENT_CONFIG, NETWORK_ID) {
    await dispatch(fetchUSDPriceOfNativeToken(chainConfig[NETWORK_ID].ID));

    const stableTokenMetaInfo = TOKENS_PAYMENT_CONFIG.map(async (token) => {
      return { ...tokenMeta[token], isStable: true };
    });
    const tokenInfo = await Promise.all(stableTokenMetaInfo);
    await setTokenData(tokenInfo);
    const nativeTokenInfo = {
      ...chainConfig[NETWORK_ID],
      symbol: CURRENCY_SYMBOL,
    };
    await setNativeToken(nativeTokenInfo);
    await setSelectedToken(nativeTokenInfo);
    await setLoading(false);
  }

  async function confirmTransaction() {
    const jsonProvider = await new ethers.providers.JsonRpcProvider(
      chainConfig[NETWORK_ID].RPC_URLS[0]
    );
    let response;
    const from = transferFrom;
    await setIsConfirming(true);
    await setConfirmInfo(null);

    if (!block) {
      await setIsConfirming(false);
      return;
    }

    if (!selectedToken.isStable) {
      response = await getLatestTransactions(
        CHAIN_ID,
        process.env.REACT_APP_MORALIS_API_KEY,
        from,
        block
      );
    } else {
      response = await getLatestTokenTransactions(
        CHAIN_ID,
        process.env.REACT_APP_MORALIS_API_KEY,
        from,
        block
      );
    }

    if (response?.data?.result?.length) {
      response.data.result.forEach(async (txn) => {
        const { transaction_hash, address, from_address, to_address, value } =
          txn;

        const contractaddress =
          stableCoinToAddress[NETWORK_ID][selectedToken.symbol];

        const formatted_to_address = ethers.utils.getAddress(to_address);
        const formatted_RECEPIENT = ethers.utils.getAddress(RECEPIENT);
        const formatted_transferFrom = ethers.utils.getAddress(transferFrom);
        const formatted_from_address = ethers.utils.getAddress(from_address);

        if (selectedToken.isStable) {
          const formatted_address = ethers.utils.getAddress(address);
          const formatted_contractaddress =
            ethers.utils.getAddress(contractaddress);
          const contract = await ERC20ContractFactory(
            contractaddress,
            jsonProvider
          );
          const decimals = await contract.decimals();

          const eventAmount = Number(toEther(value, decimals));
          const expectedAmount = Number(VALUE * COIN_PRICE_USD);

          if (
            formatted_from_address === formatted_transferFrom &&
            formatted_to_address === String(formatted_RECEPIENT) &&
            eventAmount === expectedAmount &&
            formatted_contractaddress === formatted_address
          ) {
            // console.log("Sent Stable ", value.toString());
            setTransferConfirmed(true);
            await postMessageToListeners({
              event: "pay.success",
              data: {
                value: eventAmount,
                hash: transaction_hash,
                from: formatted_from_address,
              },
            });
            await setCountdownId(
              setInterval(() => {
                setTimeLeft((P) => P - 1);
              }, 1000)
            );
          }
        } else {
          const expectedAmount = VALUE;
          const eventAmount = toEther(value, 18);

          if (
            formatted_transferFrom === formatted_from_address &&
            String(formatted_to_address) === String(formatted_RECEPIENT) &&
            eventAmount === expectedAmount
          ) {
            // console.log("Sent Native ", value.toString());
            setTransferConfirmed(true);
            await postMessageToListeners({
              event: "pay.success",
              data: {
                value: eventAmount,
                hash: transaction_hash,
                from: formatted_from_address,
              },
            });
            await setCountdownId(
              setInterval(() => {
                setTimeLeft((P) => P - 1);
              }, 1000)
            );
          }
        }
      });
    } else {
      setConfirmInfo("No transaction found, try again in few seconds.");
      setTimeout(() => {
        setConfirmInfo(null);
      }, 3000);
    }

    await setIsConfirming(false);
  }

  async function startListening(selectedToken_) {
    const jsonProvider = await new ethers.providers.JsonRpcProvider(
      chainConfig[NETWORK_ID].RPC_URLS[0]
    );

    const blockNumber = await jsonProvider.getBlockNumber();
    await setBlock(blockNumber);

    if (!blockNumber) {
      setError("Failed to get block number");
      return;
    }

    if (selectedToken_.isStable) {
      // listen to erc20 transfer event
      console.log("STABLE");
      const address = stableCoinToAddress[NETWORK_ID][selectedToken_.symbol];
      const contract = await ERC20ContractFactory(address, jsonProvider);
      const decimals = await contract.decimals();
      contract.on("Transfer", async function (from, to, amount) {
        const eventAmount = Number(toEther(amount, decimals));
        const expectedAmount = VALUE * COIN_PRICE_USD;

        if (
          from === transferFrom &&
          to === String(RECEPIENT) &&
          eventAmount === expectedAmount
        ) {
          await setTransferConfirmed(true);
          contract.removeAllListeners("Transfer");
          await postMessageToListeners({
            event: "pay.success",
            data: {
              value: eventAmount,
              hash: null,
              from: transferFrom,
            },
          });
          await setCountdownId(
              setInterval(() => {
                setTimeLeft((P) => P - 1);
              }, 1000)
            );
        }
      });
    } else {
      jsonProvider.on("block", async function (blockNumber) {
        const { transactions } = await jsonProvider.getBlockWithTransactions(
          blockNumber
        );
        transactions.forEach(async (txn) => {
          const { from, to, value } = txn;
          const eventAmount = Number(toEther(value.toString(), 18));

          if (
            String(eventAmount) === String(VALUE) &&
            from === transferFrom &&
            to === String(RECEPIENT)
          ) {
            await setTransferConfirmed(true);
            await jsonProvider.removeAllListeners("block");
            await postMessageToListeners({
              event: "pay.success",
              data: {
                value: eventAmount,
                hash: null,
                from: transferFrom,
              },
            });
            await setCountdownId(
              setInterval(() => {
                setTimeLeft((P) => P - 1);
              }, 1000)
            );
          }
        });
      });
    }
  }

  async function verifyAddress() {
    setError(null);
    setIsVerifyingAddress(true);
    const jsonProvider = new ethers.providers.JsonRpcProvider(
      chainConfig[NETWORK_ID].RPC_URLS[0]
    );

    if (transferFrom === RECEPIENT) {
      setError("Origin address cannot be the same as recepient");
      setConfirmedAddress(false);
      setIsVerifyingAddress(false);
      return;
    }
    try {
      const isAddress = await ethers.utils.isAddress(transferFrom);

      if (!isAddress) {
        const isEns = await jsonProvider.resolveName(transferFrom);

        if (isEns == null) {
          setError("Invalid address/ENS");
          setConfirmedAddress(false);
          setIsVerifyingAddress(false);
          return;
        }
        setTransferFrom(isEns);
      }

      setConfirmedAddress(true);
      setIsVerifyingAddress(false);
    } catch (error) {
      setError("Invalid address/ENS");
      setConfirmedAddress(false);
      setIsVerifyingAddress(false);
    }
  }

  async function handleTokenSelected(token) {
    setSelectedToken(token);
  }

  function isTokenSelected(token) {
    if (selectedToken && selectedToken.symbol === token) {
      return "nft_item_selected";
    } else {
      return "nft_item";
    }
  }

  function getAmountToSend() {
    if (selectedToken?.isStable) {
      return { value: COIN_PRICE_USD * VALUE, symbol: selectedToken.symbol };
    } else {
      return { value: VALUE, symbol: CURRENCY_SYMBOL };
    }
  }


  async function closeBondPay(completed, action) {
    await postMessageToListeners({
      event: "pay.exit",
      data: { completed, action },
    });
  }

  async function handleCopy(RECEPIENT) {
    await postMessageToListeners({
      event: "copy",
      data: { RECEPIENT },
    });
  }

  if(!ACCEPTING_TRANSFER){
return <Alert fontSize="small" status="warning">
        <AlertIcon />
       This Merchant is not accepting third party transfer.
      </Alert>
  }

  if (loading) {
    return (
      <section className="flex-col">
        <Spinner />
        <Text fontSize={"small"}>Please wait..</Text>
      </section>
    );
  }



  if (transactionState.CONFIG_ERROR) {
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="auto"
        borderRadius="6px"
        pb="20px"
      >
        <AlertIcon boxSize="40px" mr={0} my="1rem" />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Attention
        </AlertTitle>
        <div>{transactionState.CONFIG_ERROR}</div>
      </Alert>
    );
  }

  function getNoticeMessage() {
    return (
      <Alert fontSize="small" status="warning">
        <AlertIcon />
        Please make sure you’re sending {getAmountToSend().symbol} tokens from a {NETWORK_NAME}. Sending
        from another network would lead to loss of tokens.
      </Alert>
    );
  }

  if (transferConfirmed) {
    return (
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="auto"
        backgroundColor={"#40a79f4d"}
        fontSize="small"
      >
        <AlertIcon boxSize="40px" mr={0} color={"#40a69e"} my="1rem" />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Received!
        </AlertTitle>
        <AlertDescription maxWidth="sm" mt="1rem" mb="1.5rem">
          Payment of {getAmountToSend().value} {getAmountToSend().symbol} to
           {" "}{formatAddress(transactionState.RECEPIENT)} has been received. You can
          now close this dialog or wait for {timeLeft} Seconds.
        </AlertDescription>

        <AlertDescription my="10px" fontSize={"0.7rem"} fontWeight="bold">
          Closing Dialog in {timeLeft} Seconds.
        </AlertDescription>
      </Alert>
    );
  }

    if (confirmedAddress) {
    return (
      <Box className="flex-col" h="100%" w="100%">
        <Progress
          // colorScheme="green"
          size="xs"
          isIndeterminate
          w="100%"
          mb="15px"
        />
        <Text
          textAlign="center"
          w="100%"
          mb="2rem"
          fontSize={"small"}
        >
          Waiting for <Text
          fontWeight={"bold"}
          display="inline"
          >{getAmountToSend().value} {getAmountToSend().symbol}</Text> from{" "}
          {transferFrom}
        </Text>

        <Button
          isLoading={isConfirming}
          loadingText="Confirming.."
          variant="outline"
          onClick={confirmTransaction}
          disabled={isConfirming}
          borderRadius={"10px"}
          mb="25px"
          fontSize="small"
        >
          {isConfirming ? (
            "Confirming.."
          ) : (
            <>
              <img src={CheckIcon} />
              I&apos;ve made the transfer
            </>
          )}
        </Button>
        {confirmInfo && (
          <Alert fontSize="small" status="info" mb="1rem">
            <AlertIcon />
            {confirmInfo}
          </Alert>
        )}

        <Box display="flex" justifyContent={"space-between"} w="100%">
          <Text fontWeight={"bold"} mb="5px" fontSize={"small"}>
            Amount to transfer:
          </Text>

          <Text
            onClick={() => handleCopy(getAmountToSend().value)}
            fontWeight={"bold"}
            mb="5px"
            fontSize={"small"}
          >
            {getAmountToSend().value} {getAmountToSend().symbol}{" "}
            <CopyIcon cursor="pointer" />
          </Text>
        </Box>

        <Box
          display="flex"
          alignItems={"center"}
          justifyContent={"space-between"}
          w="100%"
          border="1px solid #011b334d"
          borderRadius="6px"
          margin="10px 0px"
          pl="17px"
        >
          <Text fontWeight={"normal"} mb="5px" fontSize={"small"}>
            {formatAddress(RECEPIENT)}
          </Text>

          <Button
            fontSize={"small"}
            onClick={async () => {
              handleCopy(RECEPIENT);
              await setCopiedAddress(true);
              setTimeout(() => {
                setCopiedAddress(false);
              }, 2000);
            }}
          >
            {copiedAddress ? "Copied" : "Copy"}
          </Button>
        </Box>

        {/* <div>Select One To Proceed</div> */}

        {getNoticeMessage()}

        {tokenTransactionState.PENDING && (
          <Text color="#59b0aa" mt="5px" fontWeight={"600"} fontSize={"0.7rem"}>
            NOTICE: Plase do not close this modal.
          </Text>
        )}

        <Button
          // variant="outline"
          onClick={() => setConfirmedAddress(false)}
          borderRadius={"10px"}
          mt="1rem"
          fontSize="small"
        >
         <ChevronLeftIcon mr="5px"/> Back
        </Button>
      </Box>
    );
  }
  return (
    <Box className="flex-col" h="100%" w="100%">
      <Text fontWeight={"bold"} mb="2rem" fontSize={"small"}>
        Select One Asset to Transfer
      </Text>

      <Box
        className="t-assets"
        maxW="340px"
        mb="15px"
        w="100%"
        overflowX={"auto"}
      >
        <Box
          onClick={() => handleTokenSelected(nativeToken)}
          className={`${isTokenSelected(CURRENCY_SYMBOL)}`}
          cursor="pointer"
          my="5px"
          textAlign={"center"}
          height="auto"
          display="flex"
          w="100%"
          flexDirection={"column"}
          justifyContent={"start"}
          alignItems="center"
        >
          <img
            style={{ width: "30px", height: "30px" }}
            src={nativeToken.large}
          />

          <Box
            ml="5px"
            flexDirection={"column"}
            display="flex"
            justifyContent={"center"}
            alignItems="start"
          >
            <Text fontSize={"small"}>{nativeToken.CURRENCY_SYMBOL}</Text>
          </Box>
        </Box>

        {tokens.map((token) => {
          return (
            <Box
              onClick={() => handleTokenSelected(token)}
              className={`${isTokenSelected(token.symbol)}`}
              cursor="pointer"
              my="5px"
              textAlign={"center"}
              height="auto"
              display="flex"
              w="100%"
              flexDirection={"column"}
              justifyContent={"start"}
              alignItems="center"
              key={token.name}
            >
              <img
                style={{ width: "30px", height: "30px" }}
                src={token.image}
              />

              <Box
                ml="5px"
                flexDirection={"column"}
                display="flex"
                justifyContent={"center"}
                alignItems="start"
              >
                <Text fontSize={"small"}>{token.symbol}</Text>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent={"space-between"}
        w="100%"
      >
        <Text fontWeight={"bold"} mb="5px" fontSize={"small"}>
          Transfer from:
        </Text>

        <Input
          onChange={(event) => setTransferFrom(event.target.value)}
          value={transferFrom}
          fontSize="small"
          placeholder="Your Address or ENS Name"
        />

        <Button
          isLoading={isVerifyingAddress}
          loadingText="Please Wait..."
          variant="outline"
          onClick={verifyAddress}
          disabled={isVerifyingAddress}
          borderRadius={"10px"}
          mb="25px"
          w="100%"
          my="1rem"
          fontSize="small"
        >
          Confirm
        </Button>

        <Alert fontSize="small" status="warning">
          <AlertIcon />
          Please make sure to cross-check and verify that the origin address/ENS
          is valid.
        </Alert>
      </Box>

      {confirmedAddress && (
        <Alert fontSize="small" status="success">
          Great! Address confirmed, please wait..
        </Alert>
      )}
      {error && (
        <Text color="red" mt="5px" fontWeight={"600"} fontSize={"0.7rem"}>
          NOTICE: {error}
        </Text>
      )}
    </Box>
  );
}
