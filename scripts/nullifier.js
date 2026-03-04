const { keccak256 } = require("ethers")

function generateNullifier(secret) {

  return keccak256(Buffer.from(secret))

}

module.exports = generateNullifier