mod vote_circuit;

use vote_circuit::VoteCircuit;
use plonky3::field::goldilocks_field::GoldilocksField;

fn main() {

    let circuit = VoteCircuit::<GoldilocksField> {

        voter_secret: GoldilocksField::from_canonical_u64(12345),

        vote: GoldilocksField::from_canonical_u64(1),

        merkle_root: GoldilocksField::from_canonical_u64(9999),

        merkle_proof: Default::default(),

    };

    circuit.build();

    println!("Vote proof generated");

}