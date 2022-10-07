import { ethers } from "ethers";
export { fetchNfts } from './moralis.api'

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
