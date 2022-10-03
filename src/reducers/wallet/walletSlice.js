import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  balance:null,
  connected: false,
  tokens:[],
  nfts:[],
  address:'',
  connecting: false
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    toggleConnectingWallet: (state) => {
        state.connecting = !state.connecting;
    },
    connected: (state) => {
      state.connected =  true;
      state.connecting = false;
    }
  },
})

export const { toggleConnectingWallet,connected } = walletSlice.actions

export default walletSlice.reducer