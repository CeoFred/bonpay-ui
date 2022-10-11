import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { selectNetwork } from "../../reducers/network/selector";
import { selectTranction } from "../../reducers/transaction/selector";
import {
  initTransction,
  transactionSuccessfull,
  transactionFailed,
} from "../../reducers/transaction/transactionSlice";
import { formatAddress, postMessageToListeners } from "../../utils/helpers";
import OpenIcon from "../../assets/icons/open.png";
import { useAppDispatch } from "../../store";
import { useBlockNative } from "../../Providers/Web3.provider";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Text,
  Stack,
} from "@chakra-ui/react";

export default function Home() {
  const dispatch = useAppDispatch();

  const networkState = useSelector(selectNetwork);
  const transactionState = useSelector(selectTranction);
  const { VALUE } = transactionState;

  const { transferNativeToken, connected, balance } = useBlockNative();

  const [timeLeft, setTimeLeft] = useState(10);
  const [countdownId, setCountdownId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (timeLeft === 0) {
      window.clearInterval(countdownId);
      closeBondPay(true, "script");
    }
  }, [timeLeft]);

  function getAccountExplorer(address) {
    return `${networkState.BLOCK_EXPLORER[0]}address/${address}`;
  }

  function getTransactionExplorer(hash) {
    return `${networkState.BLOCK_EXPLORER[0]}tx/${hash}`;
  }

  function initCountdown(transaction) {
    setCountdownId(
      setInterval(() => {
        setTimeLeft((P) => P - 1);
      }, 1000)
    );
    delete transaction.wait;

    postMessageToListeners({
      event: "pay.success",
      data: transaction,
    });
  }

  function closeBondPay(completed, action) {
    postMessageToListeners({
      event: "pay.exit",
      data: { completed, action },
    });
  }

  async function handleWalletTransfer() {
    setError(null);

    if(balance/10**18 < Number(VALUE)){
      setError("Insufficient balance for transaction");
      return;
    }

    if (!connected) {
      setError("Wallet Not Connected");
      return;
    }

    await dispatch(
      initTransction({
        TYPE: "WALLET_TRANSFER",
        STATUS: "IN_PROGRESS",
      })
    );

    try {
      const txn = await transferNativeToken(
        String(transactionState.VALUE),
        transactionState.RECEPIENT
      );
      await txn.wait(2);

      setTimeout(async () => {
        await dispatch(
          transactionSuccessfull({
            TYPE: "WALLET_TRANSFER",
            STATUS: "SUCCESS",
            TRANSACTION: txn.hash,
          })
        );
        initCountdown(txn);
      }, 1000);
    } catch (error) {
      await dispatch(
        transactionFailed({
          TYPE: "WALLET_TRANSFER",
          STATUS: "FAILED",
          MESSAGE: "Something went wrong",
        })
      );
    }
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

  if (transactionState.ERROR_MESSAGE) {
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
          Transaction Failed!
        </AlertTitle>

        <AlertDescription my="10px" fontSize={"0.7rem"} fontWeight="bold">
          <Stack direction="row" spacing={4}>
            <Button colorScheme={"red"} onClick={handleWalletTransfer}>
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

  if (transactionState.COMPLETED === true) {
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
          Transaction Successfull!
        </AlertTitle>
        <AlertDescription maxWidth="sm" mt="1rem">
          You just sent {transactionState.VALUE} {networkState.CURRENCY_SYMBOL}{" "}
          to {transactionState.RECEPIENT}. View the status of this transaction{" "}
          <a
            style={{ color: "blue" }}
            target="_blank"
            rel="noreferrer"
            href={getTransactionExplorer(transactionState.TRANSACTION)}
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

  return (
    <section className="payment-form">
      <div className="managedaccount">
        <div className="managedaccount_message">
          <h3 className="payment_value">
            Send{" "}
            <span style={{ fontWeight: "bold" }}>
              {transactionState.VALUE}{" "}
            </span>
            <span style={{ fontWeight: "bold" }}>
              {networkState.CURRENCY_SYMBOL}
            </span>{" "}
          </h3>
          <div className="managedaccount__details">
            <div className="flex-row">
              <span>Network</span>
              <span style={{ color: "#59b0aa", fontWeight: "bold" }}>
                {networkState.NETWORK_NAME}
              </span>
            </div>
            <div className="flex-row">
              <span>Receipient</span>
              <span className="flex-row">
                <span id="receipient">
                  {formatAddress(transactionState.RECEPIENT)}
                </span>
                <a
                  target="_blank"
                  rel="noreferrer"
                  id="blockexplorer"
                  href={getAccountExplorer(transactionState.RECEPIENT)}
                >
                  {" "}
                  <img className="icon" src={OpenIcon} />
                </a>
              </span>
            </div>
            <div className="flex-row">
              <span>Gas Price</span>
              <span
                id="gasfee"
                style={{ fontWeight: "bold", color: "#59b0aa" }}
              >
                -- {networkState.CURRENCY_SYMBOL}
              </span>
            </div>
          </div>
        </div>

      </div>

      <Button
        isLoading={transactionState.STATUS !== "idle"}
        loadingText="Processing.."
        colorScheme="teal"
        variant="outline"
        w="100%"
        onClick={handleWalletTransfer}
        disabled={!connected || transactionState.STATUS !== "idle"}
      >
        Proceed
      </Button>
       {error && <Text color="red" mt="5px" fontWeight={"600"} fontSize={"0.7rem"}>NOTICE: {error}</Text>}
    </section>
  );
}
