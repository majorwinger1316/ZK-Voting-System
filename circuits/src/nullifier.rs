use p3_goldilocks::Goldilocks;
use crate::poseidon::poseidon_hash;

pub fn compute_nullifier(secret: Goldilocks) -> Goldilocks {
    poseidon_hash(secret, secret)
}