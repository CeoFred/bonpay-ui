import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  chainId: "",
  rpcUrls: [],
  blockExplorer: "",
  symbol: "",
  decimals: "",
  gasFee: "",
};

export const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setUpNetworkConfig: (state, action) => {
      state = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUpNetworkConfig } = networkSlice.actions;

export default networkSlice.reducer;
