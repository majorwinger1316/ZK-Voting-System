const { keccak256 } = require("ethers");

function hash(x) {
  return keccak256(Buffer.from(x));
}

function buildTree(commitments) {
  let level = commitments.map(hash);

  while (level.length > 1) {
    const next = [];

    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] || left;

      next.push(hash(left + right));
    }

    level = next;
  }

  return level[0];
}

module.exports = { buildTree };
