import { createSelector } from "reselect";

export const selectWallet = createSelector(
  (state) => state.wallet,
  (wallet) => wallet
);


export const selectNFTs = createSelector(
  (state) => state.wallet.nfts,
  (nfts) => nfts
);