use p3_goldilocks::Goldilocks;
use crate::poseidon::poseidon_hash;

pub fn build_merkle_root(mut leaves: Vec<Goldilocks>) -> Goldilocks {

    while leaves.len() > 1 {

        let mut next = vec![];

        for i in (0..leaves.len()).step_by(2) {

            let left = leaves[i];
            let right = if i + 1 < leaves.len() {
                leaves[i+1]
            } else {
                leaves[i]
            };

            next.push(poseidon_hash(left, right));
        }

        leaves = next;
    }

    leaves[0]
}