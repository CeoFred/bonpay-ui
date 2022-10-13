export const chainConfig = {
  4: {
    RPC_URLS: ["https://rinkeby.infura.io/v3/"],
    NETWORK_NAME: "Rinkeby test network",

    CURRENCY_SYMBOL: "RinkebyETH",
    BLOCK_EXPLORER: ["https://rinkeby.etherscan.io/"],
    DECIMALS: 18,
    CHAIN_ID: "0x" + Number(4).toString(16),
    ID: "ethereum",
    thumb: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
    large: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023",
  },
  56: {
    RPC_URLS: [
      "https://speedy-nodes-nyc.moralis.io/f111f2bc63fb5a4b94e68c21/bsc/mainnet",
    ],
    NETWORK_NAME: "Binance Smart Chain",
    CHAIN_ID: "0x38",
    CURRENCY_SYMBOL: "BNB",
    BLOCK_EXPLORER: ["https://bscscan.com/"],
    DECIMALS: 18,
    ID: "binancecoin",
    thumb:
      "https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png",
    large:
      "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
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
    ID: "matic-network",

    thumb:
      "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png",
    large:
      "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
  },
  39797: {
    CHAIN_ID: "0x" + Number(39797).toString(16),
    RPC_URLS: ["https://nodeapi.energi.network"],
    NETWORK_NAME: "Energi Mainnet",
    CURRENCY_SYMBOL: "NRG",
    DECIMALS: 18,
    BLOCK_EXPLORER: ["https://explorer.energi.network/"],
    ID: "energi",
    thumb: "https://assets.coingecko.com/coins/images/5795/thumb/3218.png",
    large: "https://assets.coingecko.com/coins/images/5795/large/3218.png",
  },
  1: {
    CHAIN_ID: "0x" + Number(1).toString(16),
    RPC_URLS: [
      "https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7",
      "https://rpc.ankr.com/eth",
      "https://eth-mainnet.rpcfast.com?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf",
    ],
    NETWORK_NAME: "Ethereum Mainnet",
    CURRENCY_SYMBOL: "ETH",
    DECIMALS: 18,
    BLOCK_EXPLORER: ["https://etherscan.io/"],
    ID: "ethereum",

    thumb: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
    large: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  42: {
    CHAIN_ID: "0x" + Number(42).toString(16),
    RPC_URLS: ["https://kovan.infura.io/v3/"],
    NETWORK_NAME: "Kovan Testnet",
    CURRENCY_SYMBOL: "KovanETH",
    DECIMALS: 18,
    BLOCK_EXPLORER: ["https://kovan.etherscan.io/"],
    ID: "ethereum",

    thumb: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
    large: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  5: {
    CHAIN_ID: "0x" + Number(5).toString(16),
    RPC_URLS: ["https://goerli.infura.io/v3/7f77638fe26c4f2da743b683924aea0d"],
    NETWORK_NAME: "Goerli Testnet",
    CURRENCY_SYMBOL: "GoerliETH",
    DECIMALS: 18,
    BLOCK_EXPLORER: ["https://goerli.etherscan.io/"],
    ID: "ethereum",

    thumb: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
    large: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  97: {
    CHAIN_ID: "0x" + Number(97).toString(16),
    RPC_URLS: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    NETWORK_NAME: "BSC Testnet",
    CURRENCY_SYMBOL: "tBNB",
    DECIMALS: 18,
    BLOCK_EXPLORER: ["https://testnet.bscscan.com/"],
  },
  137: {
    CHAIN_ID: "0x" + Number(137).toString(16),
    RPC_URLS: [
      "https://polygon-mainnet.g.alchemy.com/v2/FDaxG4jpaYHddzfeC_4TMAH2EJoF5jLa/",
    ],
    NETWORK_NAME: "Polygon Mainnet",
    CURRENCY_SYMBOL: "MATIC",
    DECIMALS: 18,
    BLOCK_EXPLORER: ["https://explorer.matic.network/"],
    ID: "matic-network",

    thumb:
      "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png",
    large:
      "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
  },
};
