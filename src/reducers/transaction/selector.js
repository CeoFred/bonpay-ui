import { createSelector } from "reselect";

export const selectTranction = createSelector(
  (state) => state.transaction,
  (transaction) => transaction
);
