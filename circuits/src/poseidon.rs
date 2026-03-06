use p3_goldilocks::Goldilocks;
use p3_field::PrimeField64;

// Temporary simple hash until full Poseidon parameters are used
pub fn poseidon_hash(a: Goldilocks, b: Goldilocks) -> Goldilocks {

    let x = a.as_canonical_u64();
    let y = b.as_canonical_u64();

    // simple mixing
    Goldilocks::new((x * 31) ^ (y * 17))
}