export const chainConfig = {
  56: {
   RPC_URLS: [
      'https://speedy-nodes-nyc.moralis.io/f111f2bc63fb5a4b94e68c21/bsc/mainnet',
    ],
    NETWORK_NAME: 'Binance Smart Chain',
    CHAIN_ID: '0x38',
    CURRENCY_SYMBOL: 'BNB',
    BLOCK_EXPLORER: 'https://bscscan.com',
  },
  80001: {
     CHAIN_ID: '0x'+Number(80001).toString(16) ,
        RPC_URLS: ["https://rpc-mumbai.maticvigil.com","https://matic-mumbai.chainstacklabs.com"],
        NETWORK_NAME: "Mumbai",
        CURRENCY_SYMBOL: "MATIC",
        DECIMALS: 18,
        BLOCK_EXPLORER: ["https://mumbai.polygonscan.com/"]
  }
}
