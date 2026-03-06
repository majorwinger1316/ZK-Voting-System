export async function submitVote(data) {
  await fetch("http://localhost:3001/vote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      candidate,
      proof,
      nullifier: secret,
    }),
  });
  return res.json();
}
