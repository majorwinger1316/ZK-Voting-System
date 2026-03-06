"use client";

import { useEffect, useState } from "react";

export default function Results() {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/results/0")
      .then((r) => r.json())
      .then(setVotes);
  }, []);

  return (
    <div>
      <h2>Results</h2>

      {votes.map((v, i) => (
        <p key={i}>
          Candidate {i}: {v}
        </p>
      ))}
    </div>
  );
}
