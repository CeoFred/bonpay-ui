import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import ContractFactory from "../../utils/contract/ERC721";

const initialState = {
  TYPE: "",
  VALUE: 0,
  RECEPIENT: "",
  STATUS: "idle",
  ERROR_MESSAGE: null,
  COMPLETED: false,
  NFT_PAYMENT_CONFIG:{},
  ACCETPING_NFT: null,
  CONFIG_ERROR: null
};

export const transferNFT = createAsyncThunk(
  'wallet/transferNFT',
  async (data,{rejectWithValue, getState}) => {
    try {
      const { RECEPIENT }  = (getState().transaction);
      const { nft, provider } = data;
      const { token_address, token_id ,owner_of} = nft;
     const tokenContract = await ContractFactory(token_address,provider);
     const txn = await tokenContract.transferFrom(owner_of,RECEPIENT,token_id);
      await txn.wait(1)
     return txn;
    } catch (error) {
      return rejectWithValue(error.reason)
    }
  }
)
function validateConfig(payload){

  if(payload.NFT_CONFIG){
    const { collection } = payload.NFT_CONFIG;
    if(!collection){
      return "Dev: Specify at least one NFT collection address"
    }
  }

  if(!payload.VALUE){
     return "Dev: Specify a Value in ether."
  }
  if(!payload.RECEPIENT){
     return "Dev: Specify an address to receive payments."
  }
  if(!payload.NETWORK){
     return "Dev: Specify an EVM Compatible Network."
  }
  return null
}

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setUpTransactionDetails: (state, action) => {
      state.VALUE = action.payload.VALUE;
      state.TYPE = action.payload.TYPE;
      state.RECEPIENT = action.payload.RECEPIENT;
      state.NFT_PAYMENT_CONFIG.CONFIG = action.payload.NFT_CONFIG
      state.ACCETPING_NFT = action.payload.NFT_CONFIG ? true: false;
      state.CONFIG_ERROR = validateConfig(action.payload)
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
      state.TRANSACTION = action.payload.TRANSACTION;
    },
    transactionFailed: (state, action) => {
      state.STATUS = "idle";
      state.ERROR_MESSAGE = action.payload.MESSAGE;
      state.COMPLETED = false;
      state.TRANSACTION = null;
    },
    resetNFTTransactionState: (state, action) => {
      state.NFT_PAYMENT_CONFIG = {
        CONFIG: state.NFT_PAYMENT_CONFIG?.CONFIG
      }
    }
  },
  extraReducers : function(builder){

    builder.addCase(transferNFT.rejected, (state,action) => {
      console.log(action.payload)
      state.NFT_PAYMENT_CONFIG.COMPLETED = false;
      state.NFT_PAYMENT_CONFIG.ERROR = action.payload;
      state.NFT_PAYMENT_CONFIG.COMPLETED = false;
      state.NFT_PAYMENT_CONFIG.PENDING = false;
      
    })
    builder.addCase(transferNFT.fulfilled, (state,action) => {
       state.TRANSACTION = null
       state.NFT_PAYMENT_CONFIG.COMPLETED = true;
       state.NFT_PAYMENT_CONFIG.PENDING = false;
       state.NFT_PAYMENT_CONFIG.TRANSACTION = action.payload;

    })
    builder.addCase(transferNFT.pending, (state,action) => {
      state.TRANSACTION = "NFT"
      state.NFT_PAYMENT_CONFIG.COMPLETED = false;
      state.NFT_PAYMENT_CONFIG.PENDING = true;
      state.NFT_PAYMENT_CONFIG.NFT = action.meta.arg.nft;
      state.NFT_PAYMENT_CONFIG.ERROR = null;


    })
  }
});

export const {
  transactionSuccessfull,
  setUpTransactionDetails,
  initTransction,
  transactionFailed,
  resetNFTTransactionState
} = transactionSlice.actions;

export default transactionSlice.reducer;
