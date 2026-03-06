"use client";

import { useState } from "react";

export default function Admin() {
  const [voterCount, setVoterCount] = useState(5);
  const [voters, setVoters] = useState([]);
  const [electionId, setElectionId] = useState(null);

  async function createElection() {
    const res = await fetch("http://localhost:3001/admin/createElection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ voterCount }),
    });

    const data = await res.json();

    setVoters(data.voters);
    setElectionId(data.electionId);

    alert("Election created with ID: " + data.electionId);
  }

  return (
    <div>
      <h2>Create Election</h2>

      <input
        type="number"
        value={voterCount}
        onChange={(e) => setVoterCount(Number(e.target.value))}
      />

      <button onClick={createElection}>Create Election</button>

      {electionId !== null && <p>Election ID: {electionId}</p>}

      <h3>Generated Voters</h3>

      <pre>{JSON.stringify(voters, null, 2)}</pre>
    </div>
  );
}
