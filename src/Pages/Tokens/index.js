import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner, Text } from "@chakra-ui/react";

import { useAppDispatch } from "../../store";
import { useBlockNative } from "../../Providers/Web3.provider";
import {
  formatAddress,
  postMessageToListeners,
  weiToEther
} from "../../utils/helpers";
import { stableCoinToAddress, tokenMeta } from "../../utils/constants";
import { selectNetwork } from "../../reducers/network/selector";
import { selectWallet } from "../../reducers/wallet/selector";
import {
  transferToken,
  resetTokenTransactionState,
  fetchTokenBalance,
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
  Stack,
  Box,
} from "@chakra-ui/react";
import { chainConfig } from "../../config/chain";

export default function Tokens() {
  const { connected, provider } = useBlockNative();

  const networkState = useSelector(selectNetwork);
  const walletState = useSelector(selectWallet);
  const tokenTransactionState = useSelector(selectTokenTransaction);
  const transactionState = useSelector(selectTranction);
  const dispatch = useAppDispatch();

  const { NETWORK_ID,CURRENCY_SYMBOL } = networkState;
  const { address } = walletState;
  const { ACCEPTING_TOKENS, TOKENS_PAYMENT_CONFIG,COIN_PRICE_USD,VALUE } = transactionState;


  const [loading, setLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokens, setTokenData] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [countdownId, setCountdownId] = useState(null);
  const [error, setError] = useState(null);
  



  useEffect(() => {
    if (timeLeft === 0) {
      window.clearInterval(countdownId);
      closeBondPay(true, "script");
    }
  }, [timeLeft]);

  useEffect(() => {

    if (connected && NETWORK_ID && address && loading && ACCEPTING_TOKENS) {
      init(NETWORK_ID, address, TOKENS_PAYMENT_CONFIG.CONFIG);
    }

  }, [connected, networkState, walletState, loading, transactionState]);



  async function init(NETWORK_ID, address, TOKENS_PAYMENT_CONFIG) {
    // fetch native coin price in USD
    await dispatch(fetchUSDPriceOfNativeToken(chainConfig[NETWORK_ID].ID));
   
    // get balance of erc20 tokens for user address
    const fetchBalance = TOKENS_PAYMENT_CONFIG.map(async (token) => {
      const tokenAddress = stableCoinToAddress[NETWORK_ID][token];
      const fetchAction = await dispatch(
        fetchTokenBalance({ tokenAddress, userAddress: address, provider })
      );
      return { ...fetchAction.payload, token, ...tokenMeta[token],tokenAddress };
    });

    const tokenInfo = await Promise.all(fetchBalance);
    await setTokenData(tokenInfo);
    setLoading(false);
  }



  function getTokenBalance(token){
    return tokens.filter(t => t.token === token)[0].balance;
  }

  async function handleTokenSelected(token) {
    setSelectedToken(token);
  }

  function isTokenSelected(token) {
    if (selectedToken && selectedToken.token === token) {
      return "nft_item_selected";
    } else {
      return "nft_item";
    }
  }

  function tokenHasValidBalance(expected, actual){
    if(actual > expected) return "#59b0aa";
    return "red";
  }

  async function handlePayment() {
    await setError(null);
    
    if((COIN_PRICE_USD*Number(VALUE)) > selectedToken.balance){
        await setError("Insufficient Balance");
        return;
    }

    if (selectedToken && !tokenTransactionState.PENDING) {

      const amount = weiToEther(Number(COIN_PRICE_USD*Number(VALUE)).toFixed(1),selectedToken.decimals);

      const transferAction = await dispatch(
        transferToken({ amount,tokenAddress: selectedToken.tokenAddress, provider: provider.getSigner() })
      );
      if (!transferAction?.error) {
         await postMessageToListeners({
         event: "pay.success",
         data: {value: transferAction.payload.value, hash: transferAction.payload.hash, gasPrice: transferAction.payload.gasPrice
        },
        });
        await setCountdownId(
          setInterval(() => {
            setTimeLeft((P) => P - 1);
          }, 1000)
        );
      }
    }
  }

  function tryAgain() {
    dispatch(resetTokenTransactionState());
  }

  function getTransactionExplorer(hash) {
    return `${networkState.BLOCK_EXPLORER[0]}tx/${hash}`;
  }

  async function closeBondPay(completed, action) {
    
   await postMessageToListeners({
      event: "pay.exit",
      data: { completed, action },
    });
  }

  if (!connected) {
    return (
      <section className="flex-col">
        <Text fontSize={"large"}>No Wallet Conncted</Text>
      </section>
    );
  }
  if (!transactionState.ACCEPTING_TOKENS) {
    return (
      <Alert
        status="info"
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
        <div>Payment Method not set by Developer.</div>
      </Alert>
    );
  }

  if (loading) {
    return (
      <section className="flex-col">
        <Spinner />
        <Text fontSize={"small"}>Fetching Your token Info..</Text>
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

  if (tokenTransactionState.ERROR) {
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
      >
        <AlertIcon boxSize="40px" mr={0} my="1rem" />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Failed to Transfer {selectedToken.name}!
        </AlertTitle>
        <div>{tokenTransactionState.ERROR}</div>
        <AlertDescription my="10px" fontSize={"0.7rem"} fontWeight="bold">
          <Stack direction="row" spacing={4}>
            <Button colorScheme={"red"} onClick={tryAgain}>
              Try Again
            </Button>
            <Button
              colorScheme={"red"}
              variant="outline"
              onClick={() => closeBondPay(false, "user")}
            >
              Close
            </Button>
          </Stack>
        </AlertDescription>
      </Alert>
    );
  }

  if (tokenTransactionState.COMPLETED && selectedToken && transactionState) {
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
        borderRadius="6px"
      >
        <AlertIcon boxSize="40px" mr={0} color={"#40a69e"} my="1rem" />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          It&apos;s Gone!
        </AlertTitle>
        <AlertDescription maxWidth="sm" mt="1rem" mb="1.5rem">
          You just transfered {selectedToken.name} to{" "}
          {formatAddress(transactionState.RECEPIENT)}. View transfer{" "}
          <a
            style={{ color: "blue" }}
            target="_blank"
            rel="noreferrer"
            href={getTransactionExplorer(tokenTransactionState.TRANSACTION.hash)}
          >
            here.
          </a>
        </AlertDescription>

        <AlertDescription my="10px" fontSize={"0.7rem"} fontWeight="bold">
          Closing Dialog in {timeLeft} Seconds.
        </AlertDescription>
      </Alert>
    );
  }

  if (tokens.length === 0 && !loading) {
    return <section className="flex-col">Whoops! No Data available.</section>;
  }

  return (
    <Box className="flex-col" h="100%" w="100%">
      <Text fontWeight={"bold"} mb="5px">
        {VALUE} {CURRENCY_SYMBOL} ~ USD {COIN_PRICE_USD * VALUE}
      </Text>
      {/* <div>Select One To Proceed</div> */}

      <Box display="grid" maxW="340px" mb="15px" w="100%" overflowX={"auto"}>
        {tokens.map((token) => {
          return (
            <Box
              onClick={() => handleTokenSelected(token)}
              className={`${isTokenSelected(token.token)}`}
              cursor="pointer"
              my="5px"
              textAlign={"center"}
              key={token.token}
              height="auto"
              display="flex"
              w="100%"
              borderBottom={"1px solid #e2e8f0"}
              justifyContent={"start"} alignItems="center"
            >
              <img
                style={{ width: "25px", height: "25px" }}
                src={token.image}
              />

              <Box ml="5px" flexDirection={"column"} display="flex" justifyContent={"center"} alignItems="start">
              <Text>{token.name}</Text>
              <Box>
               <Text mb="4px" fontSize={"0.7rem"}>Balance: <span style={{color:tokenHasValidBalance(COIN_PRICE_USD * VALUE,getTokenBalance(token.token))}}>{getTokenBalance(token.token) || 0} USD</span></Text>
              </Box>
              </Box>

            </Box>
          );
        })}
      </Box>

       
      <Button
        isLoading={tokenTransactionState.PENDING}
        loadingText="Processing.."
        colorScheme="teal"
        variant="outline"
        w="100%"
        onClick={handlePayment}
        disabled={!selectedToken?.balance || tokenTransactionState.PENDING}
      >
        {!selectedToken?.balance ? 'Select One To Proceed' : 'Proceed'}
      </Button>
       {tokenTransactionState.PENDING && <Text color="#59b0aa" mt="5px" fontWeight={"600"} fontSize={"0.7rem"}>NOTICE: Plase do not close this modal.</Text>}
       {error && <Text color="red" mt="5px" fontWeight={"600"} fontSize={"0.7rem"}>NOTICE: {error}</Text>}
    </Box>
  );
}
