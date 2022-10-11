import DAILogo from "../assets/icons/tokens/DAI.webp";
import USDTLogo from "../assets/icons/tokens/USDT.webp";
import USDCLogo from "../assets/icons/tokens/USDC.webp";
import BUSDLogo from "../assets/icons/tokens/BUSD.webp";

export const mapChainToAlchemyNetworkId = {
  1: "eth-mainnet",
  ETH_ROPSTEN: "eth-ropsten",
  5: "eth-goerli",
  42: "eth-kovan",
  ETH_RINKEBY: "eth-rinkeby",
  OPT_MAINNET: "opt-mainnet",
  OPT_KOVAN: "opt-kovan",
  OPT_GOERLI: "opt-goerli",
  ARB_MAINNET: "arb-mainnet",
  ARB_RINKEBY: "arb-rinkeby",
  ARB_GOERLI: "arb-goerli",
  137: "polygon-mainnet",
  80001: "polygon-mumbai",
  ASTAR_MAINNET: "astar-mainnet",
};

export const tokenMeta = {
  DAI: {
    image: DAILogo,
    symbol: "DAI",
    description:
      "Multi-Collateral Dai, brings a lot of new and exciting features, such as support for new CDP collateral types and Dai Savings Rate.",
    name: "Dai Stablecoin (DAI)",
  },
  USDT: {
    image: USDTLogo,
    symbol: "USDT",
    description:
      "Tether gives you the joint benefits of open blockchain technology and traditional currency by converting your cash into a stable digital currency equivalent.",
    name: "Tether USD (USDT)",
  },
  USDC: {
    image: USDCLogo,
    symbol: "USDC",
    description:
      "USDC is a fully collateralized US Dollar stablecoin developed by CENTRE, the open source project with Circle being the first of several forthcoming issuers.",
    name: "USD Coin (USDC)",
  },
  BUSD: {
    image: BUSDLogo,
    symbol: "BUSD",
    description:
      "Binance USD (BUSD) is a dollar-backed stablecoin issued and custodied by Paxos Trust Company, and regulated by the New York State Department of Financial Services. BUSD is available directly for sale 1:1 with USD on Paxos.com and will be listed for trading on Binance.",
    name: "Binance USD (BUSD)",
  },
};

export const tokenIsTestNet = {
  8001: true,
  1: false,
  5: true,
};

export const stableCoinToAddress = {
  80001: {
    USDT: null,
    USDC: null,
    DAI: null,
  },
  5: {
    DAI: "0xdf1742fe5b0bfc12331d8eaec6b478dfdbd31464",
    USDC: "0xa2025b15a1757311bfd68cb14eaefcc237af5b43",
    USDT: "0xc2c527c0cacf457746bd31b2a698fe89de2b6d49",
  },
  1: {
    DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
    USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    BUSD: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
  },
  137: {
      DAI: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      USDC: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      USDT: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
      BUSD: "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3"
  },
  56: {
      DAI: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
      USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      BUSD: "0xe9e7cea3dedca5984780bafc599bd69add087d56"
  },
  39797: {
      DAI: null,
      USDC: null,
      USDT: null,
      BUSD: null
  }
};

