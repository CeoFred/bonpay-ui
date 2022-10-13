import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  ERC721ContractFactory,
  ERC20ContractFactory,
} from "../../utils/contract";
import { fetchCoinPrice, toEther, isValidToken } from "../../utils/helpers";

const initialState = {
  TYPE: "",
  VALUE: 0,
  RECEPIENT: "",
  STATUS: "idle",
  ERROR_MESSAGE: null,
  COMPLETED: false,
  NFT_PAYMENT_CONFIG: {},
  ACCETPING_NFT: null,
  CONFIG_ERROR: null,
  ACCEPTING_TOKENS: null,
  TOKENS_PAYMENT_CONFIG: {},
  COIN_PRICE_USD: null,
  ACCEPTING_TRANSFER:false
};

/**
 * Transfer Stable Coin Thunk
 *
 */
export const transferToken = createAsyncThunk(
  "transaction/transferToken",
  async (data, { rejectWithValue, getState }) => {
    try {
      const { RECEPIENT } = getState().transaction;

      const { tokenAddress, provider, amount } = data;
      const tokenContract = await ERC20ContractFactory(tokenAddress, provider);
      const txn = await tokenContract.transfer(RECEPIENT, amount);
      await txn.wait(1);
      return txn;
    } catch (error) {
      return rejectWithValue(error.reason);
    }
  }
);

export const transferNFT = createAsyncThunk(
  "transaction/transferNFT",
  async (data, { rejectWithValue, getState }) => {
    try {
      const { RECEPIENT } = getState().transaction;
      const { nft, provider } = data;
      const { token_address, token_id, owner_of } = nft;
      const tokenContract = await ERC721ContractFactory(
        token_address,
        provider
      );
      const txn = await tokenContract.transferFrom(
        owner_of,
        RECEPIENT,
        token_id
      );
      await txn.wait(1);
      return txn;
    } catch (error) {
      return rejectWithValue(error.reason);
    }
  }
);

export const fetchTokenBalance = createAsyncThunk(
  "transaction/fetchTokenBalance",
  async (data) => {
    const { tokenAddress, provider, userAddress } = data;
    const erc20Contract = await ERC20ContractFactory(tokenAddress, provider);
    const balance = await erc20Contract.balanceOf(userAddress);
    const decimals = await erc20Contract.decimals();

    return { balance: toEther(balance.toString(), decimals), decimals };
  }
);

export const fetchUSDPriceOfNativeToken = createAsyncThunk(
  "transaction/fetchUSDPriceOfNativeToken",
  async (CURRENCY_SYMBOL) => {
    const coinPrice = await fetchCoinPrice(CURRENCY_SYMBOL);
    return coinPrice;
  }
);

function validateConfig(payload) {
  if (payload.NFT_CONFIG) {
    const { collection } = payload.NFT_CONFIG;
    if (!collection) {
      return "Dev: Specify at least one NFT collection address";
    }
  }
  if (payload.TOKENS) {
    if (payload.TOKENS.length <= 0) {
      return "Dev: Tokens option set but no value specified.";
    }
    let invalidToken = null;
    payload.TOKENS.forEach((token) => {
      if (!isValidToken(payload.NETWORK, String(token).toUpperCase())) {
        invalidToken = `Dev: Invalid/Unsupported token identifier "${token}"`;
      }
    });
    if (invalidToken) {
      return invalidToken;
    }
  }

  if (!payload.VALUE) {
    return "Dev: Specify a Value in ether.";
  }
  if (!payload.RECEPIENT) {
    return "Dev: Specify an address to receive payments.";
  }
  if (!payload.NETWORK) {
    return "Dev: Specify an EVM Compatible Network.";
  }
  return null;
}

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setUpTransactionDetails: (state, action) => {
      state.VALUE = action.payload.VALUE;
      state.TYPE = action.payload.TYPE;
      state.RECEPIENT = action.payload.RECEPIENT;
      state.NFT_PAYMENT_CONFIG.CONFIG = action.payload.NFT_CONFIG;
      state.ACCETPING_NFT = action.payload?.NFT_CONFIG ? true : false;
      state.ACCEPTING_TOKENS = action.payload?.TOKENS ? true : false;
      state.TOKENS_PAYMENT_CONFIG.CONFIG = action.payload?.TOKENS;
      state.ACCEPTING_TRANSFER = action.payload?.TRANSFER ? true : false;
      state.CONFIG_ERROR = validateConfig(action.payload);

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
        CONFIG: state.NFT_PAYMENT_CONFIG?.CONFIG,
      };
    },
    resetTokenTransactionState: (state) => {
      state.TOKENS_PAYMENT_CONFIG = {
        CONFIG: state.TOKENS_PAYMENT_CONFIG?.CONFIG,
        ERROR: null,
        PENDING: false,
      };
    },
  },
  extraReducers: function (builder) {
    builder.addCase(transferToken.rejected, (state, action) => {
      state.TOKENS_PAYMENT_CONFIG.COMPLETED = false;
      state.TOKENS_PAYMENT_CONFIG.ERROR = action.payload;
      state.TOKENS_PAYMENT_CONFIG.COMPLETED = false;
      state.TOKENS_PAYMENT_CONFIG.PENDING = false;
    });
    builder.addCase(transferToken.fulfilled, (state, action) => {
      state.TRANSACTION = null;
      state.TOKENS_PAYMENT_CONFIG.COMPLETED = true;
      state.TOKENS_PAYMENT_CONFIG.PENDING = false;
      state.TOKENS_PAYMENT_CONFIG.TRANSACTION = action.payload;
    });
    builder.addCase(transferToken.pending, (state) => {
      state.TRANSACTION = "TOKEN";
      state.TOKENS_PAYMENT_CONFIG.COMPLETED = false;
      state.TOKENS_PAYMENT_CONFIG.PENDING = true;
      state.TOKENS_PAYMENT_CONFIG.ERROR = null;
    });
    builder.addCase(transferNFT.rejected, (state, action) => {
      console.log(action.payload);
      state.NFT_PAYMENT_CONFIG.COMPLETED = false;
      state.NFT_PAYMENT_CONFIG.ERROR = action.payload;
      state.NFT_PAYMENT_CONFIG.COMPLETED = false;
      state.NFT_PAYMENT_CONFIG.PENDING = false;
    });
    builder.addCase(transferNFT.fulfilled, (state, action) => {
      state.TRANSACTION = null;
      state.NFT_PAYMENT_CONFIG.COMPLETED = true;
      state.NFT_PAYMENT_CONFIG.PENDING = false;
      state.NFT_PAYMENT_CONFIG.TRANSACTION = action.payload;
    });
    builder.addCase(transferNFT.pending, (state, action) => {
      state.TRANSACTION = "NFT";
      state.NFT_PAYMENT_CONFIG.COMPLETED = false;
      state.NFT_PAYMENT_CONFIG.PENDING = true;
      state.NFT_PAYMENT_CONFIG.NFT = action.meta.arg.nft;
      state.NFT_PAYMENT_CONFIG.ERROR = null;
    });
    builder.addCase(fetchUSDPriceOfNativeToken.fulfilled, (state, action) => {
      state.COIN_PRICE_USD = action.payload;
    });
  },
});

export const {
  transactionSuccessfull,
  setUpTransactionDetails,
  initTransction,
  transactionFailed,
  resetNFTTransactionState,
  resetTokenTransactionState,
} = transactionSlice.actions;

export default transactionSlice.reducer;
