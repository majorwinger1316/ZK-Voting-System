const { keccak256 } = require("ethers");

function hash(x) {
  return keccak256(Buffer.from(x.toString()));
}

function buildTree(leaves) {
  let level = leaves.map(hash);
  const tree = [level];

  while (level.length > 1) {
    const next = [];

    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] || left;

      next.push(hash(left + right));
    }

    level = next;
    tree.push(level);
  }

  return {
    root: level[0],
    tree,
  };
}

function getProof(tree, index) {
  const proof = [];

  for (let i = 0; i < tree.length - 1; i++) {
    const level = tree[i];
    const pair = index ^ 1;

    proof.push(level[pair]);

    index = Math.floor(index / 2);
  }

  return proof;
}

module.exports = {
  buildTree,
  getProof,
};
