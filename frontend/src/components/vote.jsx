"use client";

import { useState } from "react";
import { keccak256, toUtf8Bytes } from "ethers";
import { generateIdentity } from "../services/identity";
import { submitVote } from "../services/vote";
import { generateProof } from "@/services/proof";

export default function Vote() {
  const [candidate, setCandidate] = useState(0);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("alice");

  async function handleVote(candidateId) {
    const secret = Math.floor(Math.random() * 1000000);

    const proof = await generateProof(secret, candidateId);

    console.log("Proof:", proof);
  }

  return (
    <div>
      <h2>Vote</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter voter name"
      />

      <br />
      <br />

      <button onClick={() => setCandidate(0)}>Candidate A</button>

      <button onClick={() => setCandidate(1)}>Candidate B</button>

      <br />
      <br />

      <p>Selected candidate: {candidate === 0 ? "A" : "B"}</p>

      <br />
      <br />

      <button onClick={() => handleVote(candidate)}>Submit Vote</button>

      <p>{status}</p>
    </div>
  );
}
