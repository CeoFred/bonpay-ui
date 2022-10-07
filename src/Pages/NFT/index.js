import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner, Text } from "@chakra-ui/react";

import { useAppDispatch } from "../../store";
import { useBlockNative } from "../../Providers/Web3.provider";
import { fetchNfts,formatAddress,postMessageToListeners } from '../../utils/helpers'
import { selectNetwork } from "../../reducers/network/selector";
import { selectWallet } from '../../reducers/wallet/selector'
import { fetchNFTMeta } from '../../reducers/wallet/walletSlice'
import { transferNFT,resetNFTTransactionState } from '../../reducers/transaction/transactionSlice'
import { selectNFTTranction,selectTranction } from '../../reducers/transaction/selector'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Stack,
  Box
} from "@chakra-ui/react";

export default function NFT() {

  const { connected,provider } = useBlockNative();
  const networkState = useSelector(selectNetwork);
  const walletState = useSelector(selectWallet);
  const nftTransactionState = useSelector(selectNFTTranction);
  const transactionState = useSelector(selectTranction);


  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [nfts, setNFTData] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [countdownId, setCountdownId] = useState(null);


   useEffect(() => {
    if (timeLeft === 0) {
      window.clearInterval(countdownId);
      closeBondPay(true, "script");
    }
  }, [timeLeft]);


  useEffect(() => {
    
    const { CHAIN_ID } = networkState
    const { address } = walletState;
    const { ACCETPING_NFT,NFT_PAYMENT_CONFIG } = transactionState;

    if(connected && CHAIN_ID && address && loading && ACCETPING_NFT){
      init(CHAIN_ID,address,NFT_PAYMENT_CONFIG);
    }

  }, [connected,networkState,walletState,loading,transactionState])
  
  async function init(CHAIN_ID,address,NFT_PAYMENT_CONFIG){
      const { collection } = NFT_PAYMENT_CONFIG;
      const { data } = await fetchNfts(CHAIN_ID,address,process.env.REACT_APP_MORALIS_API_KEY,collection);
      
      const result =  await dispatch(fetchNFTMeta({NFTs:data.result,provider}))
     
      if(fetchNFTMeta.fulfilled.match(result)){
         await setNFTData(result.payload);
         setLoading(false);
      }
  }

  async function handleNFTSelected(NFT){
    setSelectedNFT(NFT)
  }

  function isNFTSelected(NFT){
    if(selectedNFT && selectedNFT.collection_id === NFT.collection_id){
      return "nft_item_selected";
    } else {
      return "nft_item"
    }
  }

  async function handleNFTTransfer(){
    if(selectedNFT && !nftTransactionState.PENDING){
      const transferAction = await dispatch(transferNFT({nft:selectedNFT,provider: provider.getSigner()}))
      console.log(transferAction);
      if(!transferAction?.error){
         await setCountdownId(
      setInterval(() => {
        setTimeLeft((P) => P - 1);
      }, 1000)
    );
      }
     
    }
  }

  function tryAgain(){
    dispatch(resetNFTTransactionState())
  }

   function getTransactionExplorer(hash) {
    return `${networkState.BLOCK_EXPLORER[0]}tx/${hash}`;
  }

  function closeBondPay(completed, action) {
    postMessageToListeners({
      event: "pay.exit",
      data: { completed, action },
    });
  }

  if(!connected){
      return (
      <section className="flex-col">
        <Text fontSize={"large"}>No Wallet Conncted</Text>
      </section>
    );
  }
    if(!transactionState.ACCETPING_NFT){
    return <Alert
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
  }

  if (loading) {
    return (
      <section className="flex-col">
        <Spinner />
        <Text fontSize={"small"}>Fetching NFTs</Text>
      </section>
    );
  }



  if(transactionState.CONFIG_ERROR){
    return <Alert
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
  }

  if(nftTransactionState.ERROR){
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
          Failed to Transfer NFT!
        </AlertTitle>
        <div>{nftTransactionState.ERROR}</div>
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

  if (nftTransactionState.COMPLETED && selectedNFT && transactionState) {
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
          You just transfered {selectedNFT.name} to {formatAddress(transactionState.RECEPIENT)}. View transfer{" "} 
          <a
            style={{ color: "blue" }}
            target="_blank"
            rel="noreferrer"
            href={getTransactionExplorer(nftTransactionState.TRANSACTION.hash)}
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

  if(nfts.length === 0 && !loading) {
    return <section className="flex-col">
     Whoops! No NFTs were found.
    </section>
  }
  return <Box className="flex-col" h="100%" w="100%">
    <div>Select One To Transfer</div>

    <Box className="flex-row"  maxW="340px" overflowX={"auto"}>
  {nfts.map(NFT => {
      return <Box onClick={() => handleNFTSelected(NFT)} className={`${isNFTSelected(NFT)}`}cursor="pointer" mx="5px" textAlign={"center"} key={NFT.collection_id} height="11rem" >
        <img style={{"width": "135px","height":"135px"}} src={NFT.image} />
        <Text fontSize={"0.7rem"}>{NFT.name}</Text>
      </Box>
    })}
  </Box>

     <Button
        isLoading={nftTransactionState.PENDING}
        loadingText="Transfering.."
        colorScheme="teal"
        variant="outline"
        w="100%"
        onClick={handleNFTTransfer}
        disabled={!selectedNFT || nftTransactionState.PENDING}
      >
        Proceed
      </Button>
    
  </Box>;
}
