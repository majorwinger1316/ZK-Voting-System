import { ec as EC } from "elliptic";
import keccak256 from "keccak256";

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

export function generateIdentity() {
  const secret = crypto.getRandomValues(new Uint32Array(1))[0];

  const commitment = secret * 2 + 17;

  return {
    secret,
    commitment,
  };
}
