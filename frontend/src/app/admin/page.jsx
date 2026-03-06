"use client";

import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .admin-root {
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
    display: flex;
    align-items: center;
    gap: 8px;
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
    max-width: 700px;
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

  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #555;
    margin-bottom: 6px;
  }

  input[type="number"] {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #1a1a1a;
    width: 110px;
    outline: none;
  }

  input[type="number"]:focus {
    border-color: #1c3d5a;
    box-shadow: 0 0 0 2px rgba(28,61,90,0.1);
  }

  .btn {
    margin-top: 18px;
    padding: 9px 18px;
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

  .notice {
    margin-top: 14px;
    padding: 8px 12px;
    background: #eef4f8;
    border-left: 3px solid #1c3d5a;
    border-radius: 0 4px 4px 0;
    font-size: 13px;
    color: #1c3d5a;
  }

  .voter-list {
    display: flex;
    flex-direction: column;
    gap: 7px;
    max-height: 380px;
    overflow-y: auto;
  }

  .voter-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 9px 12px;
    background: #fafaf7;
    border: 1px solid #e8e8e2;
    border-radius: 4px;
  }

  .voter-index {
    font-size: 11px;
    font-weight: 600;
    color: #888;
    min-width: 20px;
    padding-top: 1px;
  }

  .voter-key {
    font-family: 'Courier New', monospace;
    font-size: 11.5px;
    color: #444;
    word-break: break-all;
    line-height: 1.5;
  }

  .empty {
    text-align: center;
    font-size: 13px;
    color: #bbb;
    padding: 28px 0;
  }
`;

export default function Admin() {
  const [voterCount, setVoterCount] = useState(5);
  const [voters, setVoters] = useState([]);
  const [electionId, setElectionId] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createElection() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/admin/createElection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterCount }),
      });
      const data = await res.json();
      setVoters(data.voters);
      setElectionId(data.electionId);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="admin-root">
        <div className="top-bar">
          <div className="top-bar-title">🗳 Voting Portal</div>
          <div className="top-bar-meta">Admin Panel</div>
        </div>

        <div className="nav-bar">
          <div className="nav-item active">Create Election</div>
          <div className="nav-item">Vote</div>
          <div className="nav-item">Results</div>
        </div>

        <div className="main">
          <div className="page-heading">Create Election</div>
          <div className="page-desc">
            Initialize a new election and generate voter credentials.
          </div>

          <div className="card">
            <div className="card-heading">Setup</div>
            <label>Number of voters</label>
            <input
              type="number"
              min={1}
              value={voterCount}
              onChange={(e) => setVoterCount(Number(e.target.value))}
            />
            <br />
            <button className="btn" onClick={createElection} disabled={loading}>
              {loading ? "Creating…" : "Create Election"}
            </button>
            {electionId !== null && (
              <div className="notice">
                Election created — ID: <strong>#{electionId}</strong>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-heading">
              Voter Credentials{" "}
              {voters.length > 0 && `— ${voters.length} voters`}
            </div>
            {voters.length === 0 ? (
              <div className="empty">No election created yet.</div>
            ) : (
              <div className="voter-list">
                {voters.map((voter, i) => (
                  <div className="voter-row" key={i}>
                    <span className="voter-index">{i + 1}.</span>
                    <span className="voter-key">
                      {typeof voter === "string"
                        ? voter
                        : JSON.stringify(voter)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
