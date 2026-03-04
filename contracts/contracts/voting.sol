// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Voting {
    struct Election {
        string name;
        uint256 candidateCount;
        bool active;
    }

    Election public election;

    mapping(uint256 => uint256) public votes;
    mapping(bytes32 => bool) public nullifiers;

    event VoteSubmitted(uint256 candidate, bytes32 nullifier);

    function createElection(
        string memory _name,
        uint256 _candidateCount
    ) public {
        election = Election({
            name: _name,
            candidateCount: _candidateCount,
            active: true
        });
    }

    function submitVote(uint256 candidate, bytes32 nullifier) public {
        require(election.active, "Election not active");
        require(!nullifiers[nullifier], "Already voted");
        require(candidate < election.candidateCount, "Invalid candidate");

        nullifiers[nullifier] = true;
        votes[candidate]++;

        emit VoteSubmitted(candidate, nullifier);
    }

    function getVotes(uint256 candidate) public view returns (uint256) {
        return votes[candidate];
    }
}
