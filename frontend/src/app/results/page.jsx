"use client";

import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .results-root {
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
    max-width: 600px;
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

  .lookup-row {
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }

  .lookup-field { flex: 1; }

  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #555;
    margin-bottom: 6px;
  }

  input[type="number"] {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #1a1a1a;
    outline: none;
  }

  input[type="number"]:focus {
    border-color: #1c3d5a;
    box-shadow: 0 0 0 2px rgba(28,61,90,0.1);
  }

  .btn {
    padding: 9px 18px;
    background: #1c3d5a;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    white-space: nowrap;
    height: 38px;
  }

  .btn:hover { background: #174f72; }
  .btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .summary-label {
    font-size: 12px;
    color: #888;
  }

  .summary-total {
    font-size: 13px;
    font-weight: 600;
    color: #333;
  }

  .result-item {
    margin-bottom: 14px;
  }

  .result-item:last-child { margin-bottom: 0; }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 6px;
  }

  .result-name {
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .winner-tag {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    background: #eef4f8;
    color: #1c3d5a;
    border-radius: 3px;
    border: 1px solid #c8dce8;
  }

  .result-count {
    font-size: 13px;
    color: #555;
  }

  .result-count strong {
    font-weight: 600;
    color: #1a1a1a;
  }

  .bar-track {
    height: 8px;
    background: #eee;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: #1c3d5a;
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  .result-item:not(.winner) .bar-fill {
    background: #9ab4c6;
  }

  .empty {
    text-align: center;
    font-size: 13px;
    color: #bbb;
    padding: 28px 0;
  }
`;

export default function Results() {
  const [electionId, setElectionId] = useState("");
  const [votes, setVotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadResults() {
    if (!electionId) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/results/" + electionId);
      const data = await res.json();
      setVotes(data);
      setLoaded(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const total = votes.reduce((a, b) => a + b, 0);
  const winnerIdx =
    votes.length > 0 && votes[0] !== votes[1]
      ? votes[0] > votes[1]
        ? 0
        : 1
      : -1;

  const candidateNames = ["Candidate A", "Candidate B"];

  return (
    <>
      <style>{styles}</style>
      <div className="results-root">
        <div className="top-bar">
          <div className="top-bar-title">🗳 Voting Portal</div>
          <div className="top-bar-meta">Results</div>
        </div>

        <div className="nav-bar">
          <div className="nav-item">Create Election</div>
          <div className="nav-item">Vote</div>
          <div className="nav-item active">Results</div>
        </div>

        <div className="main">
          <div className="page-heading">Election Results</div>
          <div className="page-desc">
            Look up the vote tally for a completed election.
          </div>

          <div className="card">
            <div className="card-heading">Lookup</div>
            <div className="lookup-row">
              <div className="lookup-field">
                <label>Election ID</label>
                <input
                  type="number"
                  placeholder="Enter election ID"
                  value={electionId}
                  onChange={(e) => setElectionId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadResults()}
                />
              </div>
              <button className="btn" onClick={loadResults} disabled={loading}>
                {loading ? "Loading…" : "Load Results"}
              </button>
            </div>
          </div>

          {loaded && (
            <div className="card">
              <div className="card-heading">Tally — Election #{electionId}</div>

              <div className="summary-row">
                <span className="summary-label">Total votes cast</span>
                <span className="summary-total">{total}</span>
              </div>

              {votes.length === 0 ? (
                <div className="empty">No votes found.</div>
              ) : (
                votes.map((count, i) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  const isWinner = i === winnerIdx;
                  return (
                    <div
                      className={`result-item ${isWinner ? "winner" : ""}`}
                      key={i}
                    >
                      <div className="result-header">
                        <div className="result-name">
                          {candidateNames[i]}
                          {isWinner && (
                            <span className="winner-tag">Leading</span>
                          )}
                        </div>
                        <div className="result-count">
                          <strong>{count}</strong> votes ({pct}%)
                        </div>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
