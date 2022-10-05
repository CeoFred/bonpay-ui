import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: null,
  connected: false,
  tokens: [],
  nfts: [],
  address: "",
  connecting: false,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    toggleConnectingWallet: (state) => {
      state.connecting = !state.connecting;
    },
    walletConnected: (state, action) => {
      state.connected = true;
      state.connecting = false;
      state.balance = action.payload.balance;
      state.address = action.payload.address;
    },
  },
});

export const { toggleConnectingWallet, walletConnected } = walletSlice.actions;

export default walletSlice.reducer;
