const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractJson = require("../../shared/abi.json");
const abi = contractJson.abi;

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

app.post("/vote", async (req, res) => {
  try {
    const { candidate, nullifier, leaf, merkleProof } = req.body;

    const tx = await contract.submitVote(
      candidate,
      nullifier,
      merkleProof,
      leaf,
    );

    await tx.wait();

    res.json({
      success: true,
      hash: tx.hash,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(4000, () => console.log("Relayer running on port 4000"));
