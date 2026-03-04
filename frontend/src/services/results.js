import { ethers } from "ethers";
const contractJson = require("../../shared/abi.json");
const abi = contractJson.abi;

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const contract = new ethers.Contract(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  abi,
  provider,
);

export async function getVotes(candidate) {
  return await contract.getVotes(candidate);
}
