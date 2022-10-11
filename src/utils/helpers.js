import { ethers } from "ethers";
export { fetchNfts, fetchTokenPrice } from "./moralis.api";
import { stableCoinToAddress } from './constants'
import axios from "axios";
import BigNumber from "bignumber.js";

export const formatAddress = (address) => {
  return address.slice(0, 9) + "..." + address.slice(address.length - 4);
};

export const postMessageToListeners = ({ event, data }) => {
  window.parent && window.parent.postMessage({ type: event, data }, "*");
};

export const handleBigNumberFormat = (wei) => {
  return ethers.BigNumber.from(String(wei));
};

export const toEther = (wei, decimals) => {
  return ethers.utils.formatUnits(wei, decimals);
};

export const weiToEther = (ether, decimals) => {
  return ethers.utils.parseUnits(BigNumber(ether).toString(),decimals)
}

export const roundTo = (n, digits) => {
  var negative = false;
  if (digits === undefined) {
    digits = 0;
  }
  if (n < 0) {
    negative = true;
    n = n * -1;
  }
  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  n = (Math.round(n) / multiplicator).toFixed(digits);
  if (negative) {
    n = (n * -1).toFixed(digits);
  }
  return n;
};

export const fetchCoinPrice = async (coin) => {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${coin}`
  );
  const price = response.data.market_data.current_price.usd;
  return price;
};

export const isValidToken = (network,token) => {
    if(stableCoinToAddress[network]?.[token]) return true;
    return false;
}
