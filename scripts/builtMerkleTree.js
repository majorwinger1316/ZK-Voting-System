const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const fs = require("fs");

const voters = ["0xpubkey1", "0xpubkey2", "0xpubkey3"];

const leaves = voters.map((v) => keccak256(Buffer.from(v.slice(2), "hex")));

const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

const root = tree.getHexRoot();

fs.writeFileSync(
  "./shared/tree.json",
  JSON.stringify(
    {
      voters,
      root,
      leaves: leaves.map((l) => "0x" + l.toString("hex")),
    },
    null,
    2,
  ),
);

console.log("Merkle root:", root);
