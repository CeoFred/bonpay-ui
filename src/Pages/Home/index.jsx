import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectNetwork } from "../../reducers/network/selector";
import {  selectTranction } from "../../reducers/transaction/selector";
import { initTransction,transactionSuccessfull,transactionFailed } from "../../reducers/transaction/transactionSlice"
import { formatAddress } from '../../utils/helpers'
import OpenIcon from '../../assets/icons/open.png'
import { useAppDispatch } from "../../store";
import { Spinner } from '@chakra-ui/react'
import { useBlockNative } from "../../Providers/Web3.provider";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'

export default function Home() {

  const dispatch = useAppDispatch();

  const networkState = useSelector(selectNetwork);
  const transactionState = useSelector(selectTranction);
  const { transferNativeToken } =
    useBlockNative();

  const [timeLeft, setTimeLeft] = useState(10);
  const [countdownId, setCountdownId] = useState(null);



  useEffect(() => {
    if(timeLeft === 0){
        window.clearInterval(countdownId)
    }
  }, [timeLeft])
  
  function getAccountExplorer(address){
    return `${networkState.BLOCK_EXPLORER[0]}address/${address}`
  }

  function getTransactionExplorer(hash){
    return `${networkState.BLOCK_EXPLORER[0]}tx/${hash}`
  }

  function initCountdown(){
    setCountdownId(setInterval(() => {
      setTimeLeft(P => P-1);
    }, 1000))
  }

 async function handleWalletTransfer(){

    await dispatch(initTransction({
      TYPE: "WALLET_TRANSFER",
      STATUS: "IN_PROGRESS"
    }))

    try {
    const txn = await transferNativeToken(
      String(transactionState.VALUE),
      transactionState.RECEPIENT
    )
    txn.wait();

    setTimeout(async () => {
      await dispatch(transactionSuccessfull({
      TYPE: "WALLET_TRANSFER",
      STATUS: "SUCCESS",
      TRANSACTION:txn.hash
    }))
    initCountdown();
    }, 3000);
      
    } catch (error) {

      await dispatch(transactionFailed({
      TYPE: "WALLET_TRANSFER",
      STATUS: "FAILED",
      MESSAGE: error
      }))

    }
  }


   function parseErrorMessage(error){
    console.log(error)
    return 'Whoops! Something went wrong'
  }

  if(transactionState.COMPLETED ===  true){
    return <Alert
  status='success'
  variant='subtle'
  flexDirection='column'
  alignItems='center'
  justifyContent='center'
  textAlign='center'
  height='auto'
  backgroundColor={"rgba(64, 166, 158, 0.67)"}
  borderRadius="6px"
>
  <AlertIcon boxSize='40px' mr={0} color={"#40a69e"} />
  <AlertTitle mt={4} mb={1} fontSize='lg'>
    Transaction Successfull!
  </AlertTitle>
  <AlertDescription maxWidth='sm'mt="1rem">
      You just sent {transactionState.VALUE} {networkState.CURRENCY_SYMBOL} to {transactionState.RECEPIENT}.
      View the status of this transaction <a target="_blank" rel="noreferrer" href={getTransactionExplorer(transactionState.TRANSACTION)}>here.</a>
  </AlertDescription>


  <AlertDescription my="10px" fontSize={"0.7rem"} fontWeight="bold">Closing Dialog in {timeLeft} Seconds.</AlertDescription>
</Alert>
  }
  return (
    <section className="payment-form">
      <div className="managedaccount">
        <div className="managedaccount_message">
          <h3 className="payment_value">
            Send <span style={{ fontWeight: "bold" }} >{transactionState.VALUE}  {" "}</span>
            <span style={{ fontWeight: "bold" }}>{networkState.CURRENCY_SYMBOL}</span>{" "}
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
                <span id="receipient">{formatAddress(transactionState.RECEPIENT)}</span>
                <a target="_blank" rel="noreferrer" id="blockexplorer" href={getAccountExplorer(transactionState.RECEPIENT)}>
                  {' '}
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

        <div id="error"></div>

        <div id="error">{transactionState.ERROR_MESSAGE ? parseErrorMessage(transactionState.ERROR_MESSAGE) : ''}</div>
      </div>
      <button disabled={transactionState.STATUS !== "idle"} onClick={handleWalletTransfer} className="btn-outline w-100">
       {transactionState.STATUS === "idle" ?  "Proceed"  : <Spinner /> }
      </button>
    </section>
  );
}
