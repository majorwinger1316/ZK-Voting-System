use p3_goldilocks::Goldilocks;
use crate::poseidon::poseidon_hash;
use crate::merkle_tree::build_merkle_root;

pub fn generate_tree(secrets: Vec<u64>) {

    let leaves: Vec<Goldilocks> = secrets
        .into_iter()
        .map(|s| poseidon_hash(Goldilocks::new(s), Goldilocks::new(s)))
        .collect();

    let root = build_merkle_root(leaves);

    println!("Merkle root: {}", root.as_canonical_u64());
}