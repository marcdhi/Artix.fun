// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


// User Ranking Contract
contract ArtifactRanking is Initializable, OwnableUpgradeable {
    // Ranking Levels
    enum RankLevel {
        Newcomer,
        Bronze,
        Silver,
        Gold,
        Platinum
    }

    // User Ranking Structure
    struct UserRanking {
        uint256 totalVotes;
        uint256 totalMemeSubmissions;
        RankLevel currentRank;
        uint256 points;
    }

    // State Variables
    mapping(address => UserRanking) public userRankings;
    mapping(RankLevel => uint256) public rankThresholds;

    // Events
    event RankUpdated(
        address indexed user, 
        RankLevel previousRank, 
        RankLevel newRank
    );

    // Initializer
    function initialize() public initializer {
        __Ownable_init(msg.sender);

        // Set Initial Rank Thresholds
        rankThresholds[RankLevel.Newcomer] = 0;
        rankThresholds[RankLevel.Bronze] = 50;
        rankThresholds[RankLevel.Silver] = 200;
        rankThresholds[RankLevel.Gold] = 500;
        rankThresholds[RankLevel.Platinum] = 1000;
    }

    // Update User Ranking
    function updateRanking(
        address user, 
        uint256 votesEarned, 
        bool isMemeSubmission
    ) external {
        UserRanking storage ranking = userRankings[user];
        
        // Update Vote and Submission Counts
        ranking.totalVotes += votesEarned;
        if (isMemeSubmission) {
            ranking.totalMemeSubmissions++;
        }

        // Calculate Points
        ranking.points = calculatePoints(ranking);

        // Determine New Rank
        RankLevel previousRank = ranking.currentRank;
        ranking.currentRank = calculateRankLevel(ranking.totalVotes);

        // Emit Rank Change Event
        if (previousRank != ranking.currentRank) {
            emit RankUpdated(user, previousRank, ranking.currentRank);
        }
    }

    // Point Calculation Logic
    function calculatePoints(UserRanking memory ranking) internal pure returns (uint256) {
        return 
            (ranking.totalVotes * 10) + 
            (ranking.totalMemeSubmissions * 50);
    }

    // Rank Determination
    function calculateRankLevel(uint256 totalVotes) public view returns (RankLevel) {
        if (totalVotes >= rankThresholds[RankLevel.Platinum]) return RankLevel.Platinum;
        if (totalVotes >= rankThresholds[RankLevel.Gold]) return RankLevel.Gold;
        if (totalVotes >= rankThresholds[RankLevel.Silver]) return RankLevel.Silver;
        if (totalVotes >= rankThresholds[RankLevel.Bronze]) return RankLevel.Bronze;
        return RankLevel.Newcomer;
    }
}