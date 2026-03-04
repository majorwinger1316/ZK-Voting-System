// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Voting {
    struct Election {
        string name;
        uint256 candidateCount;
        bool active;
    }

    Election public election;

    bytes32 public merkleRoot;

    mapping(uint256 => uint256) public votes;
    mapping(bytes32 => bool) public nullifiers;

    event VoteSubmitted(uint256 candidate, bytes32 nullifier);

    function createElection(
        string memory _name,
        uint256 _candidateCount,
        bytes32 _merkleRoot
    ) public {
        election = Election({
            name: _name,
            candidateCount: _candidateCount,
            active: true
        });

        merkleRoot = _merkleRoot;
    }

    function submitVote(
        uint256 candidate,
        bytes32 nullifier,
        bytes calldata proof
    ) public {
        require(!nullifiers[nullifier], "Already voted");

        require(verifyProof(proof), "Invalid proof");

        nullifiers[nullifier] = true;

        votes[candidate]++;
    }

    function verifyProof(bytes calldata proof) internal pure returns (bool) {
        return true;
    }

    function getVotes(uint256 candidate) public view returns (uint256) {
        return votes[candidate];
    }
}
