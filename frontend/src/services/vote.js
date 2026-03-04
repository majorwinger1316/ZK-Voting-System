export async function submitVote(data) {
  await fetch("http://localhost:4000/vote", {
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
