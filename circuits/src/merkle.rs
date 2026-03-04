use p3_goldilocks::Goldilocks;
use crate::poseidon::poseidon_hash;

pub fn verify_merkle_proof(
    leaf: Goldilocks,
    proof: Vec<Goldilocks>,
    root: Goldilocks,
) -> bool {

    let mut hash = leaf;

    for sibling in proof {

        hash = poseidon_hash(&[hash, sibling]);

    }

    hash == root
}