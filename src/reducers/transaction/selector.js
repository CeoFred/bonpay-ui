import { createSelector } from "reselect";

export const selectTranction = createSelector(
  (state) => state.transaction,
  (transaction) => transaction
);


export const selectNFTTranction = createSelector(
  (state) => state.transaction.NFT_PAYMENT_CONFIG,
  (nftTransaction) => nftTransaction
);
