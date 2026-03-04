use plonky3::field::types::Field;
use plonky3::hash::hashing::hash_n_to_hash;
use plonky3::hash::poseidon::PoseidonHash;
use plonky3::merkle_tree::MerkleProof;
use plonky3::plonk::circuit_builder::CircuitBuilder;

pub struct VoteCircuit<F: Field> {
    pub voter_secret: F,
    pub vote: F,
    pub merkle_root: F,
    pub merkle_proof: MerkleProof<F>,
}

impl<F: Field> VoteCircuit<F> {

    pub fn build(&self) {

        let mut builder = CircuitBuilder::<F>::new();

        let secret = builder.constant(self.voter_secret);

        let vote = builder.constant(self.vote);

        let root = builder.constant(self.merkle_root);

        // compute leaf
        let leaf = hash_n_to_hash::<F, PoseidonHash>(&[secret]);

        // verify merkle proof
        let valid = self.merkle_proof.verify(root, leaf);

        builder.assert_bool(valid);

        // compute nullifier
        let nullifier = hash_n_to_hash::<F, PoseidonHash>(&[secret]);

        // vote must be small integer
        let max_vote = builder.constant(F::from_canonical_u64(10));

        let vote_valid = builder.less_than(vote, max_vote);

        builder.assert_bool(vote_valid);

        builder.build();
    }
}