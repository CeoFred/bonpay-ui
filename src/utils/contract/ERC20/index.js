import { ethers } from "ethers";
import ABI from "./ABI.json";

export default function (address, provider) {
  return new ethers.Contract(address, ABI, provider);
}
