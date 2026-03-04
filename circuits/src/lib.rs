use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_vote_proof(secret: u64, vote: u64) -> String {

    // placeholder proof for now
    format!("proof_{}_{}", secret, vote)

}