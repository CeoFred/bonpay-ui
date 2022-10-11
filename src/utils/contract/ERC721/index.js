import { ethers } from "ethers";
import ERC721ABI from "./ABI.json";

function ContractFactory(contractAddress, provider) {
  return new ethers.Contract(contractAddress, ERC721ABI, provider);
}

export default ContractFactory;
