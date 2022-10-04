import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  TYPE: "",
  VALUE: 0,
  RECEPIENT: "",
  STATUS: "idle",
  ERROR_MESSAGE:"",
  COMPLETED: false
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setUpTransactionDetails: (state, action) => {
      state.VALUE = action.payload.VALUE;
      state.TYPE = action.payload.TYPE;
      state.RECEPIENT = action.payload.RECEPIENT;
    },
    initTransction: (state, action) => {
      state.TYPE = action.payload.TYPE;
      state.STATUS = action.payload.STATUS;
      state.ERROR_MESSAGE = null;
    },
    transactionSuccessfull: (state, action) => {
      state.STATUS = "idle";
      state.ERROR_MESSAGE = null;
      state.COMPLETED = true;
      state.TRANSACTION =  action.payload.TRANSACTION
    },
    transactionFailed: (state, action) => {
      state.STATUS = "idle";
      state.ERROR_MESSAGE = action.payload.MESSAGE;
      state.COMPLETED = false;
      state.TRANSACTION =  null
    }
  },
});

export const { transactionSuccessfull,setUpTransactionDetails,initTransction ,transactionFailed} = transactionSlice.actions;

export default transactionSlice.reducer;
