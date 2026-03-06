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
  try {
    const { electionId, candidate, nullifier } = req.body;

    console.log("Submitting vote:", electionId, candidate, nullifier);

    const tx = await contract.submitVote(
      Number(electionId),
      Number(candidate),
      Number(nullifier),
    );

    console.log("TX hash:", tx.hash);

    await tx.wait();

    console.log("Vote stored");

    res.json({ success: true });
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: err.message });
  }
});

app.get("/results/:id", async (req, res) => {
  const electionId = Number(req.params.id);

  const votes = await contract.getVotes(electionId);

  res.json(votes.map((v) => Number(v)));
});

const { generateVoters } = require("../../scripts/generateVoters.js");
const { buildTree } = require("../../shared/merkle");

app.post("/admin/createElection", async (req, res) => {
  try {
    const voterCount = Number(req.body.voterCount);

    console.log("Generating voters:", voterCount);

    const voters = generateVoters(voterCount);

    const commitments = voters.map((v) => v.commitment);

    const root = buildTree(commitments);

    const rootHex = root.startsWith("0x") ? root : "0x" + root;

    console.log("Merkle root:", rootHex);

    const tx = await contract.createElection(
      "Election " + Date.now(),
      2,
      rootHex,
    );

    await tx.wait();

    const electionId = Number(await contract.electionCount()) - 1;

    res.json({
      electionId,
      voters,
      root: rootHex,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/admin/test", (req, res) => {
  res.json({ message: "admin route working" });
});

app.listen(3001, () => {
  console.log("Relayer running");
});
