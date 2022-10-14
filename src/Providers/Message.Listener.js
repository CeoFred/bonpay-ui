import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { setUpNetworkConfig } from "../reducers/network/networkSlice";
import { setUpTransactionDetails } from "../reducers/transaction/transactionSlice";
import { chainConfig } from "../config/chain";

export default function MessageListener({ children }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.addEventListener("message", messageResolver);
  }, []);

  async function messageResolver(event) {
    if (event.data.type === "sdkData") {
      const { chainId, recipient, value, nft, tokens,transfer } = event.data.config;

      await dispatch(
        setUpNetworkConfig({
          ...chainConfig[chainId],
          NETWORK_ID: chainId,
        })
      );

      await dispatch(
        setUpTransactionDetails({
          VALUE: value,
          RECEPIENT: recipient,
          NFT_CONFIG: nft,
          NETWORK: chainId,
          TOKENS: tokens,
          TRANSFER: transfer
        })
      );
    }
  }

  return children;
}
