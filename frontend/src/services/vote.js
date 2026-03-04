export async function submitVote(candidate, nullifier) {
  const res = await fetch("http://localhost:4000/vote", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      candidate,
      nullifier,
    }),
  });

  return res.json();
}
