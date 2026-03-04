"use client";

import { useState } from "react";
import { keccak256, toUtf8Bytes } from "ethers";
import { generateIdentity } from "../services/identity";
import { submitVote } from "../services/vote";

export default function Vote() {
  const [candidate, setCandidate] = useState(0);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("alice");

  async function handleVote() {
    try {
      setStatus("Generating proof...");

      const identity = generateIdentity(name);

      const uuid = crypto.randomUUID();

      const nullifier = keccak256(toUtf8Bytes(uuid));

      const result = await submitVote({
        candidate,
        nullifier,
        leaf: identity.leaf,
        merkleProof: identity.proof,
      });

      console.log(result);

      setStatus("Vote submitted!");
    } catch (err) {
      console.error(err);

      setStatus("Vote failed");
    }
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

      <button onClick={handleVote}>Submit Vote</button>

      <p>{status}</p>
    </div>
  );
}
