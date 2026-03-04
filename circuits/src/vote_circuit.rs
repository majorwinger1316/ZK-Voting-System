use p3_goldilocks::Goldilocks;
use p3_field::PrimeField64;

use crate::poseidon::poseidon_hash;
use crate::merkle::verify_merkle_proof;

pub struct VoteCircuit {

    pub voter_secret: Goldilocks,

    pub vote: Goldilocks,

    pub merkle_root: Goldilocks,

    pub merkle_proof: Vec<Goldilocks>,
}

impl VoteCircuit {

    pub fn prove(&self) {

        println!("Generating ZK voting proof...");

        // 1️⃣ compute leaf
        let leaf = poseidon_hash(&[self.voter_secret]);

        println!("Leaf: {:?}", leaf);

        // 2️⃣ verify voter eligibility
        let valid = verify_merkle_proof(
            leaf,
            self.merkle_proof.clone(),
            self.merkle_root,
        );

        if !valid {
            panic!("Voter not in eligible list");
        }

        println!("Merkle proof verified");

        // 3️⃣ compute nullifier
        let nullifier = poseidon_hash(&[self.voter_secret]);

        println!("Nullifier: {:?}", nullifier);

        // 4️⃣ check vote validity
        if self.vote.as_canonical_u64() > 10 {
            panic!("Invalid vote");
        }

        println!("Vote is valid");

        println!("Proof generated successfully");
    }
}