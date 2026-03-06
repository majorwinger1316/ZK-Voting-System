import Vote from "../components/vote";

export default function Home() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>ZK Voting System</h1>

      <a href="/admin">Admin</a>

      <br />

      <a href="/vote">Vote</a>

      <br />

      <a href="/results">Results</a>
    </div>
  );
}
