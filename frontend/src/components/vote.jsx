"use client";

import { useState } from "react";
import { generateProof } from "@/services/proof";

export default function Vote() {
  const [candidate, setCandidate] = useState(0);
  const [status, setStatus] = useState("");

  async function handleVote() {
    const secret = Math.floor(Math.random() * 1000000);

    const proof = await generateProof(secret, candidate);

    await fetch("http://localhost:3001/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nullifier: proof.nullifier,
        candidate: proof.candidate,
      }),
    });

    setStatus("Vote submitted!");
  }

  return (
    <div>
      <h2>Vote</h2>

      <button onClick={() => setCandidate(0)}>Candidate A</button>

      <button onClick={() => setCandidate(1)}>Candidate B</button>

      <br />
      <br />

      <button onClick={handleVote}>Submit Vote</button>

      <p>{status}</p>
    </div>
  );
}
