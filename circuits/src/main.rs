mod vote_circuit;
mod poseidon;
mod merkle;

use vote_circuit::VoteCircuit;
use p3_goldilocks::Goldilocks;
use crate::poseidon::poseidon_hash;

fn main() {

    let secret = Goldilocks::new(12345);

    // leaf = hash(secret)
    let leaf = poseidon_hash(&[secret]);

    // simulate simple 2-level tree
    let sibling = Goldilocks::new(999);

    let root = poseidon_hash(&[leaf, sibling]);

    let circuit = VoteCircuit {

        voter_secret: secret,

        vote: Goldilocks::new(1),

        merkle_root: root,

        merkle_proof: vec![sibling],
    };

    circuit.prove();
}