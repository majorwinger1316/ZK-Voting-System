"use client";

import { useState } from "react";
import { generateProof } from "@/services/proof";

export default function VotePage() {
  const [secret, setSecret] = useState("");
  const [candidate, setCandidate] = useState(0);

  async function handleVote() {
    const proof = await generateProof(secret, candidate);

    await fetch("http://localhost:3001/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        electionId: 0,
        nullifier: Number(proof.nullifier),
        candidate: Number(proof.candidate),
      }),
    });

    alert("Vote submitted");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Vote</h1>

      <input
        placeholder="Enter your voter secret"
        onChange={(e) => setSecret(e.target.value)}
      />

      <br />
      <br />

      <button onClick={() => setCandidate(0)}>Candidate A</button>

      <button onClick={() => setCandidate(1)}>Candidate B</button>

      <br />
      <br />

      <button onClick={handleVote}>Submit Vote</button>
    </div>
  );
}
