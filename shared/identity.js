const crypto = require("crypto");

function generateIdentity() {
  const secret = crypto.randomBytes(32).toString("hex");

  const commitment = crypto.createHash("sha256").update(secret).digest("hex");

  return {
    secret,
    commitment,
  };
}

module.exports = { generateIdentity };
