// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


// Main Meme Contest Contract
contract ArtifactMemeContest is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using Counters for Counters.Counter;

    // Meme Submission Structure
    struct MemeSubmission {
        uint256 id;
        address creator;
        string ipfsHash;
        string title;
        string description;
        string socialLinks;
        uint256 networkId;
        uint256 voteCount;
        uint256 submissionTime;
        bool isActive;
        bool hasBeenMinted;
    }

    // Voting Configurations
    struct VotingConfig {
        uint256 maxVotes;
        uint256 contestDuration;
        uint256 minVotesForWin;
        uint256 voteCost;
    }

    // State Variables
    Counters.Counter private _memeIds;
    mapping(uint256 => MemeSubmission) public memes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => uint256[]) public userVotedMemes;
    
    VotingConfig public votingConfiguration;
    
    // Events for Transparency
    event MemeSubmitted(
        uint256 indexed memeId, 
        address indexed creator, 
        string ipfsHash, 
        string title, 
        uint256 networkId
    );
    event VoteCast(
        uint256 indexed memeId, 
        address indexed voter, 
        uint256 votingPower
    );
    event MemeWinner(
        uint256 indexed memeId, 
        address indexed creator, 
        uint256 voteCount
    );

    // Initializer (replaces constructor for upgradeable contracts)
    function initialize(
        uint256 _maxVotes, 
        uint256 _contestDuration, 
        uint256 _minVotesForWin,
        uint256 _voteCost
    ) public initializer {
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();

        // Set initial voting configurations
        votingConfiguration = VotingConfig({
            maxVotes: _maxVotes,
            contestDuration: _contestDuration,
            minVotesForWin: _minVotesForWin,
            voteCost: _voteCost
        });
    }

    // Meme Submission Function
    function submitMeme(
        string memory ipfsHash,
        string memory title,
        string memory description,
        string memory socialLinks,
        uint256 networkId
    ) external payable nonReentrant {
        // Validate submission
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
        require(bytes(title).length > 0, "Title required");

        _memeIds.increment();
        uint256 newMemeId = _memeIds.current();

        // Create Meme Submission
        memes[newMemeId] = MemeSubmission({
            id: newMemeId,
            creator: msg.sender,
            ipfsHash: ipfsHash,
            title: title,
            description: description,
            socialLinks: socialLinks,
            networkId: networkId,
            voteCount: 0,
            submissionTime: block.timestamp,
            isActive: true,
            hasBeenMinted: false
        });

        emit MemeSubmitted(newMemeId, msg.sender, ipfsHash, title, networkId);
    }

    // Voting Mechanism
    function voteMeme(uint256 memeId) external payable nonReentrant {
        MemeSubmission storage meme = memes[memeId];
        
        // Voting Validations
        require(meme.isActive, "Meme is not active");
        require(!hasVoted[memeId][msg.sender], "Already voted");
        require(msg.value >= votingConfiguration.voteCost, "Insufficient vote cost");

        // Cast Vote
        meme.voteCount++;
        hasVoted[memeId][msg.sender] = true;
        userVotedMemes[msg.sender].push(memeId);

        emit VoteCast(memeId, msg.sender, 1);

        // Check for Winner
        if (meme.voteCount >= votingConfiguration.maxVotes) {
            meme.isActive = false;
            emit MemeWinner(memeId, meme.creator, meme.voteCount);
        }
    }

    // Admin Functions
    function updateVotingConfiguration(
        uint256 _maxVotes, 
        uint256 _contestDuration, 
        uint256 _minVotesForWin,
        uint256 _voteCost
    ) external onlyOwner {
        votingConfiguration.maxVotes = _maxVotes;
        votingConfiguration.contestDuration = _contestDuration;
        votingConfiguration.minVotesForWin = _minVotesForWin;
        votingConfiguration.voteCost = _voteCost;
    }
}


