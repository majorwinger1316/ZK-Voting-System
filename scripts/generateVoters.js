const crypto = require("crypto");

for (let i = 0; i < 10; i++) {
  const secret = crypto.randomBytes(32).toString("hex");

  console.log(secret);
}
