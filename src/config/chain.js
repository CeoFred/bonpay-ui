export const chainConfig = {
  56: {
    RPC_URLS: [
      "https://speedy-nodes-nyc.moralis.io/f111f2bc63fb5a4b94e68c21/bsc/mainnet",
    ],
    NETWORK_NAME: "Binance Smart Chain",
    CHAIN_ID: "0x38",
    CURRENCY_SYMBOL: "BNB",
    BLOCK_EXPLORER: ["https://bscscan.com/"],
     DECIMALS: 18
  },
  80001: {
    CHAIN_ID: "0x" + Number(80001).toString(16),
    RPC_URLS: [
      "https://rpc-mumbai.maticvigil.com",
      "https://matic-mumbai.chainstacklabs.com",
    ],
    NETWORK_NAME: "Mumbai",
    CURRENCY_SYMBOL: "MATIC",
    DECIMALS: 18,
    BLOCK_EXPLORER: ["https://mumbai.polygonscan.com/"],
  },
  39797: {
    CHAIN_ID: "0x" + Number(39797).toString(16),
    RPC_URLS: ["https://nodeapi.energi.network"],
    NETWORK_NAME: "Energi Mainnet",
    CURRENCY_SYMBOL: "NRG",
    DECIMALS: 18,
    BLOCK_EXPLORER: ["https://explorer.energi.network/"],
  },
  1: {
    CHAIN_ID: "0x" + Number(1).toString(16),
    RPC_URLS: ["https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7",'https://rpc.ankr.com/eth','https://eth-mainnet.rpcfast.com?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf'],
    NETWORK_NAME: "Ethereum Mainnet",
    CURRENCY_SYMBOL: "ETH",
    DECIMALS: 18,
    BLOCK_EXPLORER: ["https://etherscan.io/"],
  },
  42: {
    CHAIN_ID: "0x" + Number(42).toString(16),
    RPC_URLS: ["https://kovan.infura.io/v3/"],
    NETWORK_NAME: "Kovan Testnet",
    CURRENCY_SYMBOL: "KovanETH",
    DECIMALS: 18,
    BLOCK_EXPLORER: ["https://kovan.etherscan.io/"],
  },
  5: {
    CHAIN_ID: "0x" + Number(5).toString(16),
    RPC_URLS: ["https://goerli.infura.io/v3/"],
    NETWORK_NAME: "Goerli Testnet",
    CURRENCY_SYMBOL: "GoerliETH",
    DECIMALS: 18,
    BLOCK_EXPLORER: ["https://goerli.etherscan.io/"],
  }
};
