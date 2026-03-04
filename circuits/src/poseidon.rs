use p3_goldilocks::Goldilocks;
use p3_field::PrimeField64;

pub fn poseidon_hash(input: &[Goldilocks]) -> Goldilocks {

    // simple field hash placeholder
    // (later replaced with real Poseidon)

    let mut acc = Goldilocks::new(0);

    for x in input {
        acc = acc + *x;
    }

    acc
}