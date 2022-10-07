import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  NETWORK_NAME: "",
  CHAIN_ID: null,
  RPC_URLS: [],
  BLOCK_EXPLORER: [],
  DECIMALS: "",
  GAS_FEE: null,
  NETWORK_ID: null,
};

export const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setUpNetworkConfig: (state, action) => {
      state.NETWORK_NAME = action.payload.NETWORK_NAME;
      state.CHAIN_ID = action.payload.CHAIN_ID;
      state.RPC_URLS = action.payload.RPC_URLS;
      state.DECIMALS = action.payload.DECIMALS;
      state.CURRENCY_SYMBOL = action.payload.CURRENCY_SYMBOL;
      state.BLOCK_EXPLORER = action.payload.BLOCK_EXPLORER;
      state.NETWORK_ID = action.payload.NETWORK_ID;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUpNetworkConfig } = networkSlice.actions;

export default networkSlice.reducer;
