"use client";

import { useState } from "react";

export default function Admin() {
  const [voters, setVoters] = useState("alice,bob,charlie");

  async function createElection() {
    const list = voters.split(",");

    await fetch("http://localhost:3001/admin/createElection", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        voters: list,
      }),
    });

    alert("Election created");
  }

  return (
    <div>
      <h2>Admin Panel</h2>

      <textarea value={voters} onChange={(e) => setVoters(e.target.value)} />

      <br />

      <button onClick={createElection}>Create Election</button>
    </div>
  );
}
