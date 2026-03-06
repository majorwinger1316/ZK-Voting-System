"use client";

import { useState } from "react";

export default function Results() {
  const [electionId, setElectionId] = useState(0);
  const [votes, setVotes] = useState([]);

  async function loadResults() {
    const res = await fetch("http://localhost:3001/results/" + electionId);

    const data = await res.json();

    setVotes(data);
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Election Results</h1>

      <p>Election ID</p>

      <input
        type="number"
        value={electionId}
        onChange={(e) => setElectionId(Number(e.target.value))}
      />

      <br />
      <br />

      <button onClick={loadResults}>Load Results</button>

      <br />
      <br />

      {votes.length > 0 && (
        <div>
          <p>Candidate A: {votes[0]}</p>

          <p>Candidate B: {votes[1]}</p>
        </div>
      )}
    </div>
  );
}
