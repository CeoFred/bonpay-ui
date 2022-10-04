import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import networkReducer from "../reducers/network/networkSlice";
import walletReducer from "../reducers/wallet/walletSlice";
import transactionReducer from "../reducers/transaction/transactionSlice";

export const store = configureStore({
  reducer: {
    network: networkReducer,
    wallet: walletReducer,
    transaction: transactionReducer
  },
});

export const useAppDispatch = () => useDispatch();
