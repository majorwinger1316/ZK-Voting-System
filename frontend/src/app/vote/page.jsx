"use client";

import { useState } from "react";
import { keccak256, toUtf8Bytes } from "ethers";

export default function Vote() {
  const [secret, setSecret] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [electionId, setElectionId] = useState("");
  const [status, setStatus] = useState("");

  async function vote() {
    if (!electionId) {
      setStatus("Enter election ID");
      return;
    }

    if (!secret) {
      setStatus("Enter voter secret");
      return;
    }

    if (candidate === null) {
      setStatus("Select a candidate");
      return;
    }

    try {
      const hash = keccak256(toUtf8Bytes(secret + electionId));

      const nullifier = parseInt(hash.slice(2, 10), 16);

      const res = await fetch("http://localhost:3001/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electionId: Number(electionId),
          candidate: Number(candidate),
          nullifier: Number(nullifier),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("Vote submitted successfully");
      } else {
        setStatus(data.error || "Vote failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error submitting vote");
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Vote</h2>

      <p>Election ID</p>

      <input
        type="number"
        placeholder="Enter election ID"
        value={electionId}
        onChange={(e) => setElectionId(e.target.value)}
      />

      <p>Voter Secret</p>

      <input
        style={{ width: "400px" }}
        placeholder="Paste voter secret"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
      />

      <br />
      <br />

      <p>Select Candidate</p>

      <button
        onClick={() => setCandidate(0)}
        style={{
          background: candidate === 0 ? "#4CAF50" : "#eee",
        }}
      >
        Candidate A
      </button>

      <button
        onClick={() => setCandidate(1)}
        style={{
          background: candidate === 1 ? "#4CAF50" : "#eee",
        }}
      >
        Candidate B
      </button>

      <br />
      <br />

      <button onClick={vote}>Submit Vote</button>

      <p>{status}</p>
    </div>
  );
}
