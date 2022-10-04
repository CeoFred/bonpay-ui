import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { setUpNetworkConfig } from '../reducers/network/networkSlice'
import { setUpTransactionDetails } from '../reducers/transaction/transactionSlice'
import { chainConfig } from "../config/chain";

export default function MessageListener({ children }) {

  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("message", messageResolver);
  }, []);

  async function messageResolver(event) {
    if(event.data.type === 'sdkData'){
      const {chainId, recepient, value } = event.data.config;
      dispatch(setUpNetworkConfig({
          ...chainConfig[chainId],
          NETWORK_ID:chainId
      }))
      dispatch(setUpTransactionDetails({
        VALUE: value,
        RECEPIENT: recepient
      }))
    }
  }

  return children;
}
