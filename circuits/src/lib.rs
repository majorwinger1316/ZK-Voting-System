use wasm_bindgen::prelude::*;

mod poseidon;
mod merkle_proof;
mod nullifier;
mod vote_circuit;

use vote_circuit::VoteCircuit;
use p3_goldilocks::Goldilocks;

#[wasm_bindgen]
pub fn generate_vote_proof(secret: u64, vote: u64) -> String {

    let circuit = VoteCircuit {
        secret: Goldilocks::new(secret),
        vote: Goldilocks::new(vote),
        merkle_root: Goldilocks::new(9999),
        merkle_proof: vec![Goldilocks::new(111)],
    };

    let (nullifier, vote) = circuit.prove();

    format!("{}:{}", nullifier, vote)
}