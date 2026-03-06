import init, { generate_vote_proof } from "../zk/circuits.js";

let initialized = false;

export async function generateProof(secret, vote) {
  if (!initialized) {
    await init();
    initialized = true;
  }

  const result = generate_vote_proof(BigInt(secret), BigInt(vote));

  const [nullifier, candidate] = result.split(":");

  return {
    nullifier,
    candidate,
  };
}
