const { ethers } = require("ethers");
require("dotenv").config({ path: "../relayer/.env" });
const contractJson = require("../shared/abi.json");
const abi = contractJson.abi;

const tree = require("../shared/tree.json");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

async function main() {
  const tx = await contract.createElection("Student Election", 2, tree.root);

  await tx.wait();

  console.log("Election created");
}

main();
