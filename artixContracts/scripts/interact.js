const { ethers } = require("hardhat");
require('dotenv').config();

/**
 * Contract Addresses from Environment Variables
 */
const ADDRESSES = {
    MEME_CONTEST: process.env.MEME_CONTEST_ADDRESS,
    NFT: process.env.NFT_ADDRESS,
    RANKING: process.env.RANKING_ADDRESS
};

// Validate addresses
Object.entries(ADDRESSES).forEach(([key, value]) => {
    if (!value) {
        throw new Error(`Missing environment variable for ${key}`);
    }
});

/**
 * MemeContest Contract Interface
 * Use this class to interact with the MemeContest contract in your frontend
 */
class MemeContestService {
    constructor(provider) {
        const MemeContest = ethers.getContractFactory("ArtifactMemeContest");
        this.contract = MemeContest.attach(ADDRESSES.MEME_CONTEST);
        this.provider = provider;
    }

    /**
     * Create a new meme contest
     * @param {string} name - Contest name
     * @param {string} description - Contest description
     * @param {number} duration - Contest duration in seconds
     * @returns {Promise<ethers.ContractTransaction>}
     */
    async createContest(name, description, duration) {
        return await this.contract.createContest(name, description, duration);
    }

    /**
     * Submit a meme to a contest
     * @param {string} ipfsHash - IPFS URI of the meme
     * @param {string} title - Meme title
     * @param {string} description - Meme description
     * @param {string} socialLinks - Creator's social media links
     * @param {number} networkId - Target network ID
     * @returns {Promise<ethers.ContractTransaction>}
     */
    async submitMeme(ipfsHash, title, description, socialLinks, networkId) {
        return await this.contract.submitMeme(
            ipfsHash,
            title,
            description,
            socialLinks,
            networkId,
            { gasLimit: 500000 }
        );
    }

    /**
     * Vote for a meme
     * @param {number} contestId - ID of the contest
     * @param {number} memeId - ID of the meme
     * @returns {Promise<ethers.ContractTransaction>}
     */
    async vote(contestId, memeId) {
        const voteCost = await this.contract.VOTE_COST();
        return await this.contract.vote(contestId, memeId, { value: voteCost });
    }

    /**
     * Get contest details
     * @param {number} contestId - ID of the contest
     * @returns {Promise<Object>} Contest details
     */
    async getContest(contestId) {
        return await this.contract.contests(contestId);
    }

    /**
     * Get meme details
     * @param {number} contestId - ID of the contest
     * @param {number} memeId - ID of the meme
     * @returns {Promise<Object>} Meme details
     */
    async getMeme(contestId, memeId) {
        return await this.contract.getMeme(contestId, memeId);
    }
}

/**
 * Ranking Contract Interface
 */
class RankingService {
    constructor(provider) {
        const Ranking = ethers.getContractFactory("ArtifactRanking");
        this.contract = Ranking.attach(ADDRESSES.RANKING);
        this.provider = provider;
    }

    /**
     * Update a user's score
     * @param {string} userId - User's address
     * @param {number} newScore - New score value
     * @returns {Promise<ethers.ContractTransaction>}
     */
    async updateScore(userId, newScore) {
        return await this.contract.updateUserScore(userId, newScore);
    }

    /**
     * Get top ranked users
     * @param {number} count - Number of users to retrieve
     * @returns {Promise<Array>} Array of top users with their scores
     */
    async getTopUsers(count) {
        return await this.contract.getTopUsers(count);
    }

    /**
     * Get user's current score
     * @param {string} userId - User's address
     * @returns {Promise<number>}
     */
    async getUserScore(userId) {
        return await this.contract.scores(userId);
    }
}

/**
 * NFT Contract Interface
 */
class NFTService {
    constructor(provider) {
        const NFT = ethers.getContractFactory("ArtifactNFT");
        this.contract = NFT.attach(ADDRESSES.NFT);
        this.provider = provider;
    }

    /**
     * Mint a new NFT
     * @param {string} to - Recipient address
     * @param {string} tokenURI - IPFS URI of the NFT metadata
     * @returns {Promise<ethers.ContractTransaction>}
     */
    async mint(to, tokenURI) {
        return await this.contract.safeMint(to, tokenURI);
    }

    /**
     * Get token URI
     * @param {number} tokenId - ID of the token
     * @returns {Promise<string>} Token URI
     */
    async getTokenURI(tokenId) {
        return await this.contract.tokenURI(tokenId);
    }

    /**
     * Get owner of token
     * @param {number} tokenId - ID of the token
     * @returns {Promise<string>} Owner address
     */
    async ownerOf(tokenId) {
        return await this.contract.ownerOf(tokenId);
    }
}

// Example usage and testing
async function main() {
    const [signer] = await ethers.getSigners();
    
    // Initialize services
    const memeContest = new MemeContestService(signer);
    const ranking = new RankingService(signer);
    const nft = new NFTService(signer);

    try {
        // Create a contest
        console.log("Creating contest...");
        const createTx = await memeContest.createContest(
            "Meme of the Month",
            "Best memes of March 2024",
            30 * 24 * 60 * 60 // 30 days
        );
        await createTx.wait();

        // Submit a meme
        console.log("Submitting meme...");
        const submitTx = await memeContest.submitMeme(
            "ipfs://QmYourMemeHash", // TODO: Replace with actual meme hash
            "Meme Title",
            "Meme Description",
            "https://twitter.com/meme_creator",
            1 // TODO: Replace with actual network ID
        );
        await submitTx.wait();

        // Get contest details
        const contest = await memeContest.getContest(0);
        console.log("Contest details:", contest);

        // Update user ranking
        console.log("Updating ranking...");
        const rankingTx = await ranking.updateScore(signer.address, 100);
        await rankingTx.wait();

        // Get top users
        const topUsers = await ranking.getTopUsers(5);
        console.log("Top users:", topUsers);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Run the example if called directly
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

// Export services for frontend use
module.exports = {
    ADDRESSES,
    MemeContestService,
    RankingService,
    NFTService
}; 