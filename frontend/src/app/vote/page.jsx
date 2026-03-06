"use client";

import { useState } from "react";
import { keccak256, toUtf8Bytes } from "ethers";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .vote-root {
    min-height: 100vh;
    background: #f5f5f0;
    font-family: 'Inter', sans-serif;
    color: #1a1a1a;
  }

  .top-bar {
    background: #1c3d5a;
    padding: 13px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .top-bar-title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  .top-bar-meta {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
  }

  .nav-bar {
    background: #fff;
    border-bottom: 1px solid #ddd;
    padding: 0 32px;
    display: flex;
    gap: 4px;
  }

  .nav-item {
    padding: 11px 14px;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    user-select: none;
  }

  .nav-item.active {
    color: #1c3d5a;
    border-bottom-color: #1c3d5a;
    font-weight: 500;
  }

  .main {
    max-width: 560px;
    margin: 0 auto;
    padding: 32px;
  }

  .page-heading {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .page-desc {
    font-size: 13px;
    color: #888;
    margin-bottom: 28px;
  }

  .card {
    background: #fff;
    border: 1px solid #e2e2dc;
    border-radius: 6px;
    padding: 24px;
    margin-bottom: 16px;
  }

  .card-heading {
    font-size: 13px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0ea;
  }

  .field-group {
    margin-bottom: 16px;
  }

  .field-group:last-child { margin-bottom: 0; }

  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #555;
    margin-bottom: 6px;
  }

  input[type="number"],
  input[type="text"] {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #1a1a1a;
    outline: none;
  }

  input[type="number"] { width: 140px; }

  input:focus {
    border-color: #1c3d5a;
    box-shadow: 0 0 0 2px rgba(28,61,90,0.1);
  }

  input[type="text"].mono {
    font-family: 'Courier New', monospace;
    font-size: 12.5px;
  }

  .candidates {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .candidate-btn {
    padding: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #fafaf7;
    cursor: pointer;
    text-align: center;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.15s, background 0.15s;
  }

  .candidate-btn:hover {
    border-color: #aaa;
    background: #f2f2ec;
  }

  .candidate-btn.selected {
    border-color: #1c3d5a;
    background: #eef4f8;
  }

  .candidate-btn .c-name {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 3px;
  }

  .candidate-btn .c-sub {
    font-size: 11px;
    color: #999;
  }

  .candidate-btn.selected .c-name { color: #1c3d5a; }

  .btn {
    width: 100%;
    padding: 10px 18px;
    background: #1c3d5a;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
  }

  .btn:hover { background: #174f72; }
  .btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .status-msg {
    margin-top: 12px;
    padding: 9px 12px;
    border-radius: 4px;
    font-size: 13px;
  }

  .status-msg.success {
    background: #edfaf3;
    border-left: 3px solid #2d9c68;
    color: #1e7a50;
  }

  .status-msg.error {
    background: #fdf0f0;
    border-left: 3px solid #d94f4f;
    color: #b33;
  }

  .status-msg.info {
    background: #eef4f8;
    border-left: 3px solid #1c3d5a;
    color: #1c3d5a;
  }
`;

export default function Vote() {
  const [secret, setSecret] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [electionId, setElectionId] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info");
  const [loading, setLoading] = useState(false);

  async function vote() {
    if (!electionId) {
      setStatus("Please enter an election ID.");
      setStatusType("error");
      return;
    }
    if (!secret) {
      setStatus("Please enter your voter secret.");
      setStatusType("error");
      return;
    }
    if (candidate === null) {
      setStatus("Please select a candidate.");
      setStatusType("error");
      return;
    }

    setLoading(true);
    try {
      const hash = keccak256(toUtf8Bytes(secret + electionId));
      const nullifier = parseInt(hash.slice(2, 10), 16);

      const res = await fetch("http://localhost:3001/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electionId: Number(electionId),
          candidate: Number(candidate),
          nullifier: Number(nullifier),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("Your vote has been submitted.");
        setStatusType("success");
      } else {
        setStatus(data.error || "Vote submission failed.");
        setStatusType("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("Network error. Please try again.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="vote-root">
        <div className="top-bar">
          <div className="top-bar-title">🗳 Voting Portal</div>
          <div className="top-bar-meta">Cast Ballot</div>
        </div>

        <div className="nav-bar">
          <div className="nav-item">Create Election</div>
          <div className="nav-item active">Vote</div>
          <div className="nav-item">Results</div>
        </div>

        <div className="main">
          <div className="page-heading">Cast Your Vote</div>
          <div className="page-desc">
            Enter your credentials and select a candidate.
          </div>

          <div className="card">
            <div className="card-heading">Credentials</div>
            <div className="field-group">
              <label>Election ID</label>
              <input
                type="number"
                placeholder="e.g. 1"
                value={electionId}
                onChange={(e) => setElectionId(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Voter Secret</label>
              <input
                type="text"
                className="mono"
                placeholder="Paste your voter secret here"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-heading">Select Candidate</div>
            <div className="candidates">
              <div
                className={`candidate-btn ${candidate === 0 ? "selected" : ""}`}
                onClick={() => setCandidate(0)}
              >
                <div className="c-name">Candidate A</div>
                <div className="c-sub">Option 1</div>
              </div>
              <div
                className={`candidate-btn ${candidate === 1 ? "selected" : ""}`}
                onClick={() => setCandidate(1)}
              >
                <div className="c-name">Candidate B</div>
                <div className="c-sub">Option 2</div>
              </div>
            </div>
          </div>

          <button className="btn" onClick={vote} disabled={loading}>
            {loading ? "Submitting…" : "Submit Vote"}
          </button>

          {status && <div className={`status-msg ${statusType}`}>{status}</div>}
        </div>
      </div>
    </>
  );
}
