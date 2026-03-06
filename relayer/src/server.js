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
  try {
    const electionId = Number(req.params.id);

    console.log("Fetching results for election:", electionId);

    const votes = await contract.getVotes(electionId);

    // convert BigInts to normal numbers
    const formatted = votes.map((v) => Number(v));

    res.json(formatted);
  } catch (err) {
    console.error("RESULTS ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

const { buildTree } = require("../../shared/merkle");

app.post("/admin/createElection", async (req, res) => {
  try {
    const { voters } = req.body;

    console.log("Creating election with voters:", voters);

    const root = buildTree(voters);

    console.log("Merkle root:", root);

    const tx = await contract.createElection("Student Election", 2, root);

    await tx.wait();

    res.json({
      success: true,
      root,
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
