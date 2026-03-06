use p3_goldilocks::Goldilocks;
use p3_field::PrimeField64;

use crate::poseidon::poseidon_hash;
use crate::merkle_proof::verify_merkle;
use crate::nullifier::compute_nullifier;

pub struct VoteCircuit {

    pub secret: Goldilocks,
    pub vote: Goldilocks,
    pub merkle_root: Goldilocks,
    pub merkle_proof: Vec<Goldilocks>,

}

impl VoteCircuit {

    pub fn prove(&self) -> (u64, u64) {

        // create leaf
        let leaf = poseidon_hash(self.secret, self.secret);

// temporarily skip eligibility check
// if !verify_merkle(leaf, self.merkle_proof.clone(), self.merkle_root) {
//     panic!("Voter not eligible");
// }

        // create nullifier
        let nullifier = compute_nullifier(self.secret);

        // vote constraint
let vote_val = self.vote.as_canonical_u64();

if vote_val > 1 {
    panic!("Invalid candidate");
}

        (
            nullifier.as_canonical_u64(),
            self.vote.as_canonical_u64(),
        )
    }
}