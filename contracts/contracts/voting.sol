// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    struct Election {
        string name;
        bytes32 merkleRoot;
        uint256 candidateCount;
        uint256[] votes;
    }

    uint256 public electionCount;

    mapping(uint256 => Election) public elections;

    mapping(uint256 => mapping(uint256 => bool)) public nullifiers;

    event ElectionCreated(uint256 id, string name);

    event VoteSubmitted(
        uint256 electionId,
        uint256 candidate,
        uint256 nullifier
    );

    function createElection(
        string memory name,
        uint256 candidateCount,
        bytes32 merkleRoot
    ) public {
        Election storage e = elections[electionCount];

        e.name = name;
        e.candidateCount = candidateCount;
        e.merkleRoot = merkleRoot;

        for (uint i = 0; i < candidateCount; i++) {
            e.votes.push(0);
        }

        emit ElectionCreated(electionCount, name);

        electionCount++;
    }

    function submitVote(
        uint256 electionId,
        uint256 candidate,
        uint256 nullifier
    ) public {
        require(!nullifiers[electionId][nullifier], "Already voted");

        Election storage e = elections[electionId];

        require(candidate < e.candidateCount, "Invalid candidate");

        nullifiers[electionId][nullifier] = true;

        e.votes[candidate]++;

        emit VoteSubmitted(electionId, candidate, nullifier);
    }

    function getVotes(
        uint256 electionId
    ) public view returns (uint256[] memory) {
        return elections[electionId].votes;
    }
}
