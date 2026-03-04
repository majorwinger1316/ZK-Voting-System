"use client";

import { submitVote } from "../services/vote";
import { useState } from "react";
import { keccak256, toUtf8Bytes } from "ethers";

export default function Vote() {
  const [candidate, setCandidate] = useState(0);

  async function handleVote() {
    try {
      const uuid = crypto.randomUUID();
      const nullifier = keccak256(toUtf8Bytes(uuid));

      const result = await submitVote(candidate, nullifier);

      console.log(result);
    } catch (err) {
      console.error("Vote failed:", err);
    }
  }

  return (
    <div>
      <h2>Vote</h2>

      <button onClick={() => setCandidate(0)}>Candidate A</button>

      <button onClick={() => setCandidate(1)}>Candidate B</button>

      <button onClick={handleVote}>Submit Vote</button>
    </div>
  );
}
