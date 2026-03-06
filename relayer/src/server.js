require("dotenv").config();
const express = require("express");
const ethers = require("ethers");
const cors = require("cors");
const contractJson = require("../../shared/abi.json");
const abi = contractJson.abi;

const app = express();

app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});
app.post("/vote", async (req, res) => {
  const { nullifier, candidate } = req.body;

  const tx = await contract.submitVote(nullifier, candidate);

  await tx.wait();

  res.json({ success: true });
});

app.listen(3001, () => console.log("Relayer running"));
