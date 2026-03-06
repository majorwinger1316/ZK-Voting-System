import { ec as EC } from "elliptic";
import keccak256 from "keccak256";
import { keccak256 } from "ethers";

const ec = new EC("secp256k1");

export function createIdentity() {
  const key = ec.genKeyPair();

  const privateKey = key.getPrivate("hex");
  const publicKey = key.getPublic("hex");

  const commitment = keccak256(Buffer.from(publicKey, "hex")).toString("hex");

  return {
    privateKey,
    publicKey,
    commitment: "0x" + commitment,
  };
}

export function generateIdentity(secret) {
  const commitment = keccak256(secret);

  return {
    secret,
    commitment,
  };
}
