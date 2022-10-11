import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ContractFactory from "../../utils/contract/ERC721";
import axios from "axios";

const initialState = {
  balance: null,
  connected: false,
  tokens: [],
  NFTs: [],
  address: null,
  connecting: false,
};

export const fetchNFTMeta = createAsyncThunk(
  "wallet/fetchNFTMeta",
  async (data) => {
    const { NFTs, provider } = data;

    const formatted = NFTs.map(async (nft) => {
      const tokenContract = await ContractFactory(nft.token_address, provider);
      const jsonURI = await tokenContract.tokenURI(nft.token_id);
      const nftMeta = await axios.get(jsonURI);
      return await { ...nft, ...nftMeta.data };
    });
    const res = await Promise.all(formatted);

    return res;
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(fetchNFTMeta.fulfilled, (state, action) => {
      state.NFTS = action.payload;
    });
  },
});

export const { toggleConnectingWallet, walletConnected } = walletSlice.actions;

export default walletSlice.reducer;
