export async function generateProof(secret, candidate, electionId) {
  const nullifier = Math.abs(hashCode(secret + electionId));

  return {
    nullifier,
    candidate,
    electionId,
  };
}

function hashCode(str) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }

  return hash;
}
