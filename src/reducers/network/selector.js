import { createSelector } from "reselect";

export const selectNetwork = createSelector(
  (state) => state.network,
  (network) => network
);
