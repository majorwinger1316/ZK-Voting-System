export async function submitVote(data) {
  const res = await fetch("http://localhost:4000/vote", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  return res.json();
}
