const crypto = require("crypto");

function generateVoters(count) {
  const voters = [];

  for (let i = 0; i < count; i++) {
    const secret = crypto.randomBytes(32).toString("hex");

    const commitment = crypto.createHash("sha256").update(secret).digest("hex");

    voters.push({
      id: i,
      secret,
      commitment,
    });
  }

  return voters;
}

module.exports = { generateVoters };
