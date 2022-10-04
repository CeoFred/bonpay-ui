import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import networkReducer from "../reducers/network/networkSlice";
import walletReducer from "../reducers/wallet/walletSlice";

export const store = configureStore({
  reducer: {
    network: networkReducer,
    wallet: walletReducer,
  },
});

export const useAppDispatch = () => useDispatch();
