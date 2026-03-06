"use client";

import { useState } from "react";
import { keccak256, toUtf8Bytes } from "ethers";

// ─── Shared Styles ────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .app {
    min-height: 100vh;
    background: #f5f5f0;
    font-family: 'Inter', sans-serif;
    color: #1a1a1a;
  }

  /* Top bar */
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

  /* Nav */
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
    transition: color 0.15s;
  }
  .nav-item:hover { color: #333; }
  .nav-item.active {
    color: #1c3d5a;
    border-bottom-color: #1c3d5a;
    font-weight: 500;
  }

  /* Layout */
  .main {
    max-width: 700px;
    margin: 0 auto;
    padding: 32px;
  }
  .main.narrow { max-width: 560px; }
  .main.mid    { max-width: 600px; }

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

  /* Card */
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

  /* Forms */
  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #555;
    margin-bottom: 6px;
  }
  .field-group { margin-bottom: 16px; }
  .field-group:last-child { margin-bottom: 0; }

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
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  input[type="number"].short { width: 110px; }
  input:focus {
    border-color: #1c3d5a;
    box-shadow: 0 0 0 2px rgba(28,61,90,0.1);
  }
  input.mono {
    font-family: 'Courier New', monospace;
    font-size: 12.5px;
  }

  /* Buttons */
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
    transition: background 0.15s;
  }
  .btn:hover { background: #174f72; }
  .btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .btn.block { width: 100%; }
  .btn.mt { margin-top: 18px; }

  /* Inline row for lookup */
  .lookup-row {
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }
  .lookup-row .field-group { flex: 1; margin-bottom: 0; }

  /* Notice / status */
  .notice {
    margin-top: 14px;
    padding: 8px 12px;
    background: #eef4f8;
    border-left: 3px solid #1c3d5a;
    border-radius: 0 4px 4px 0;
    font-size: 13px;
    color: #1c3d5a;
  }
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

  /* Voter list */
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

  /* Candidates */
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
  .candidate-btn:hover { border-color: #aaa; background: #f2f2ec; }
  .candidate-btn.selected { border-color: #1c3d5a; background: #eef4f8; }
  .c-name {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 3px;
  }
  .c-sub { font-size: 11px; color: #999; }
  .candidate-btn.selected .c-name { color: #1c3d5a; }

  /* Results */
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .summary-label { font-size: 12px; color: #888; }
  .summary-total { font-size: 13px; font-weight: 600; color: #333; }

  .result-item { margin-bottom: 14px; }
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
  .result-count { font-size: 13px; color: #555; }
  .result-count strong { font-weight: 600; color: #1a1a1a; }

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
  .result-item.loser .bar-fill { background: #9ab4c6; }

  .empty {
    text-align: center;
    font-size: 13px;
    color: #bbb;
    padding: 28px 0;
  }
`;

// ─── Admin Page ───────────────────────────────────────────────────────────────

function AdminPage() {
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
          className="short"
          min={1}
          value={voterCount}
          onChange={(e) => setVoterCount(Number(e.target.value))}
        />
        <br />
        <button className="btn mt" onClick={createElection} disabled={loading}>
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
          Voter Credentials {voters.length > 0 && `— ${voters.length} voters`}
        </div>
        {voters.length === 0 ? (
          <div className="empty">No election created yet.</div>
        ) : (
          <div className="voter-list">
            {voters.map((voter, i) => (
              <div className="voter-row" key={i}>
                <span className="voter-index">{i + 1}.</span>
                <span className="voter-key">
                  {typeof voter === "string" ? voter : JSON.stringify(voter)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Vote Page ────────────────────────────────────────────────────────────────

function VotePage() {
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
    <div className="main narrow">
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
            className="short"
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
          {[
            { id: 0, name: "Candidate A", sub: "Option 1" },
            { id: 1, name: "Candidate B", sub: "Option 2" },
          ].map((c) => (
            <div
              key={c.id}
              className={`candidate-btn ${candidate === c.id ? "selected" : ""}`}
              onClick={() => setCandidate(c.id)}
            >
              <div className="c-name">{c.name}</div>
              <div className="c-sub">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn block" onClick={vote} disabled={loading}>
        {loading ? "Submitting…" : "Submit Vote"}
      </button>

      {status && <div className={`status-msg ${statusType}`}>{status}</div>}
    </div>
  );
}

// ─── Results Page ─────────────────────────────────────────────────────────────

function ResultsPage() {
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

  return (
    <div className="main mid">
      <div className="page-heading">Election Results</div>
      <div className="page-desc">
        Look up the vote tally for a completed election.
      </div>

      <div className="card">
        <div className="card-heading">Lookup</div>
        <div className="lookup-row">
          <div className="field-group">
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
                  className={`result-item ${isWinner ? "" : "loser"}`}
                  key={i}
                >
                  <div className="result-header">
                    <div className="result-name">
                      {["Candidate A", "Candidate B"][i]}
                      {isWinner && <span className="winner-tag">Leading</span>}
                    </div>
                    <div className="result-count">
                      <strong>{count}</strong> votes ({pct}%)
                    </div>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ─── Root App with Routing ────────────────────────────────────────────────────

const PAGES = {
  admin: {
    label: "Create Election",
    meta: "Admin Panel",
    component: AdminPage,
  },
  vote: { label: "Vote", meta: "Cast Ballot", component: VotePage },
  results: { label: "Results", meta: "View Results", component: ResultsPage },
};

export default function VotingPortal() {
  const [page, setPage] = useState("admin");
  const { meta, component: Page } = PAGES[page];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="top-bar">
          <div className="top-bar-title">🗳 Voting Portal</div>
          <div className="top-bar-meta">{meta}</div>
        </div>

        <div className="nav-bar">
          {Object.entries(PAGES).map(([key, { label }]) => (
            <div
              key={key}
              className={`nav-item ${page === key ? "active" : ""}`}
              onClick={() => setPage(key)}
            >
              {label}
            </div>
          ))}
        </div>

        <Page />
      </div>
    </>
  );
}
