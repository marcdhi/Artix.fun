const express = require('express');
const { Scraper } = require('agent-twitter-client');
const Anthropic = require('@anthropic-ai/sdk');
const { ethers } = require('ethers');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const ArtixNFTABI =  [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "enum ArtifactNFT.Network",
        "name": "network",
        "type": "uint8"
      }
    ],
    "name": "NFTMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      },
      {
        "internalType": "enum ArtifactNFT.Network",
        "name": "network",
        "type": "uint8"
      }
    ],
    "name": "mintMemeNFT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const {
  AgentKit,
  CdpWalletProvider,
  walletActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider
} = require("@coinbase/agentkit");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());


// Initialize Twitter scraper and Claude
let scraper = null;
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize CDP AgentKit and wallet
let agentKit = null;
let cdpWallet = null;

// Add these constants at the top with other configs
const ARTIX_NFT_ADDRESS = process.env.ARTIX_NFT_ADDRESS;
const PROVIDER_URL = process.env.PROVIDER_URL || 'https://sepolia.base.org';

// Initialize scraper and login with both basic and V2 functionality
async function initializeScraper() {
  try {
    scraper = new Scraper();
    
    // Initialize with both basic auth and API keys
    await scraper.login(
      process.env.TWITTER_USERNAME,
      process.env.TWITTER_PASSWORD,
      process.env.TWITTER_EMAIL, // Optional email for 2FA
      process.env.TWITTER_2FA_SECRET, // Optional 2FA secret
      process.env.TWITTER_API_KEY,
      process.env.TWITTER_API_SECRET_KEY,
      process.env.TWITTER_ACCESS_TOKEN,
      process.env.TWITTER_ACCESS_TOKEN_SECRET
    );

    console.log('Twitter scraper initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Twitter scraper:', error);
    return false;
  }
}

// Initialize CDP Agent
async function initializeCDPAgent() {
  try {
    // Configure CDP Wallet Provider
    const config = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    // Initialize wallet provider
    const walletProvider = await CdpWalletProvider.configureWithWallet(config);
    
    // Initialize AgentKit with necessary action providers
    agentKit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        walletActionProvider(),
        cdpApiActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        cdpWalletActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      ],
    });

    // Get and log available actions for debugging
    const actions = agentKit.getActions();
    console.log('Available CDP Agent actions:', actions.map(a => ({
      name: a.name,
      description: a.description,
      schema: a.schema.description
    })));

    cdpWallet = walletProvider;
    console.log('CDP Agent initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize CDP Agent:', error);
    return false;
  }
}

// Helper function to shorten address
function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper function to get OpenSea URL
function getOpenSeaUrl(contractAddress, tokenId) {
  return `https://testnets.opensea.io/assets/base_sepolia/${contractAddress}/${tokenId}`;
}

// Generate tweet content using Claude
async function generateTweetContent(prompt) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Generate an engaging tweet about: ${prompt}. 
        Requirements:
        - Maximum 180 characters (STRICT limit)
        - Include 1-2 relevant emojis
        - Include 1-2 relevant hashtags
        - Keep it fun and web3-native
        - If there's a creator, tag them
        - Be concise and impactful`
      }]
    });
    
    const tweetContent = message.content[0].text;
    // Double check length and truncate if needed
    if (tweetContent.length > 180) {
      return tweetContent.substring(0, 177) + "...";
    }
    return tweetContent;
  } catch (error) {
    console.error('Error generating tweet with Claude:', error);
    throw error;
  }
}

// AI Chat endpoint that generates and posts tweets
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, useGrok = false } = req.body;

    if (!scraper) {
      const initialized = await initializeScraper();
      if (!initialized) {
        return res.status(500).json({ error: 'Failed to initialize Twitter client' });
      }
    }

    // Check if scraper is properly logged in
    const isLoggedIn = await scraper.isLoggedIn();
    if (!isLoggedIn) {
      console.error('Twitter scraper is not logged in');
      return res.status(500).json({ error: 'Twitter authentication failed' });
    }

    let tweetContent;
    let grokInsights = null;

    // Generate tweet content using Claude
    tweetContent = await generateTweetContent(prompt);

    // If Grok insights are requested, get them
    if (useGrok) {
      try {
        const grokResponse = await scraper.grokChat({
          messages: [{
            role: 'user',
            content: `Analyze this tweet and suggest improvements for viral potential: ${tweetContent}`
          }],
          returnSearchResults: true
        });
        grokInsights = grokResponse.message;
        
        // Generate improved tweet based on Grok's suggestions
        tweetContent = await generateTweetContent(
          `Improve this tweet based on these suggestions: ${grokInsights}\nOriginal tweet: ${tweetContent}`
        );
      } catch (error) {
        console.warn('Grok analysis failed, proceeding with original tweet:', error);
      }
    }

    try {
      // Use basic sendTweet instead of V2
      const response = await scraper.sendTweet(tweetContent);
      
      // Check for errors in the response
      if (response.errors || (response.data && response.data.errors)) {
        const errors = response.errors || response.data.errors;
        throw new Error(`Failed to post tweet: ${JSON.stringify(errors)}`);
      }

      res.json({
        success: true,
        tweet: response,
        grokInsights,
        message: 'Tweet posted successfully',
        content: tweetContent
      });
    } catch (tweetError) {
      console.error('Error posting tweet:', tweetError);
      res.status(500).json({ 
        error: 'Failed to post tweet',
        details: tweetError.message,
        content: tweetContent
      });
    }

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message
    });
  }
});

// Endpoint to promote a winning meme
app.post('/api/promote-meme', async (req, res) => {
  try {
    const { memeTitle, memeDescription, memeIpfsHash, creator, voteCount } = req.body;

    if (!scraper) {
      const initialized = await initializeScraper();
      if (!initialized) {
        return res.status(500).json({ error: 'Failed to initialize Twitter client' });
      }
    }

    try {
      // Create initial announcement tweet
      const announcementText = `🎉 New Winning Meme Alert! 🎉\n\n"${memeTitle}"\n\nCreated by: ${creator}\nVotes: ${voteCount}\n\n#ArtixMeme #NFT`;
      const announcementTweet = await scraper.sendTweet(announcementText);
      
      if (announcementTweet.errors || (announcementTweet.data && announcementTweet.data.errors)) {
        throw new Error(`Failed to post announcement tweet: ${JSON.stringify(announcementTweet.errors || announcementTweet.data.errors)}`);
      }

      const tweetId = announcementTweet.data?.id;

      // Create thread with more details
      const threadTweets = [
        `🎨 Meme Details:\n\n${memeDescription}\n\n#ArtixMeme #NFTCommunity`,
        `🌟 View this meme on Artix:\nartix.fun/meme/${memeIpfsHash}\n\n💫 Join our community and start creating!\n\n#Web3 #NFTs`
      ];

      // Post thread replies
      for (const tweetContent of threadTweets) {
        const replyTweet = await scraper.sendTweet(tweetContent, tweetId);
        if (replyTweet.errors || (replyTweet.data && replyTweet.data.errors)) {
          console.warn('Error posting thread tweet:', replyTweet.errors || replyTweet.data.errors);
        }
      }

      res.json({
        success: true,
        tweetId: tweetId,
        message: 'Meme promotion campaign started successfully'
      });

    } catch (tweetError) {
      console.error('Error posting promotion tweets:', tweetError);
      res.status(500).json({ 
        error: 'Failed to promote meme',
        details: tweetError.message
      });
    }

  } catch (error) {
    console.error('Error in promote-meme endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to process meme promotion',
      details: error.message 
    });
  }
});

// Endpoint to create engagement campaign
app.post('/api/create-engagement', async (req, res) => {
  try {
    const { memeId, tweetId } = req.body;

    if (!scraper) {
      const initialized = await initializeScraper();
      if (!initialized) {
        return res.status(500).json({ error: 'Failed to initialize Twitter client' });
      }
    }

    try {
      // Get trending hashtags
      const trends = await scraper.getTrends();
      const relevantTrends = trends
        .filter(trend => trend.toLowerCase().includes('meme') || trend.toLowerCase().includes('nft'))
        .slice(0, 2); // Limit to 2 trends to keep tweet shorter

      const tweetContent = `🎮 Join the fun at Artix.fun!\n\nVote, create, and earn with your favorite memes!\n\nCheck out our latest trending meme: artix.fun/meme/${memeId}\n\n${relevantTrends.join(' ')} #ArtixMeme`;
      
      const engagementTweet = await scraper.sendTweet(tweetContent, tweetId);

      if (engagementTweet.errors || (engagementTweet.data && engagementTweet.data.errors)) {
        throw new Error(`Failed to post engagement tweet: ${JSON.stringify(engagementTweet.errors || engagementTweet.data.errors)}`);
      }

      res.json({
        success: true,
        tweetId: engagementTweet.data?.id,
        message: 'Engagement campaign created successfully',
        content: tweetContent
      });

    } catch (tweetError) {
      console.error('Error posting engagement tweet:', tweetError);
      res.status(500).json({ 
        error: 'Failed to create engagement campaign',
        details: tweetError.message
      });
    }

  } catch (error) {
    console.error('Error in create-engagement endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to process engagement campaign',
      details: error.message
    });
  }
});

// Endpoint to analyze meme performance
app.get('/api/analyze-meme/:tweetId', async (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!scraper) {
      const initialized = await initializeScraper();
      if (!initialized) {
        return res.status(500).json({ error: 'Failed to initialize Twitter client' });
      }
    }

    // Get tweet analytics
    const tweet = await scraper.getTweetV2(tweetId, {
      expansions: ['attachments.poll_ids'],
      pollFields: ['options', 'end_datetime', 'voting_status']
    });

    res.json({
      success: true,
      analytics: {
        tweet: tweet.data,
        pollResults: tweet.includes?.polls?.[0]
      }
    });

  } catch (error) {
    console.error('Error analyzing meme performance:', error);
    res.status(500).json({ error: 'Failed to analyze meme performance' });
  }
});

// Endpoint for CDP Agent to check and mint NFTs
app.post('/api/cdp/check-and-mint', async (req, res) => {
  try {
    const { memeId, voteCount, memeMetadata } = req.body;

    // Initialize CDP Agent if not already initialized
    if (!agentKit || !cdpWallet) {
      const initialized = await initializeCDPAgent();
      if (!initialized) {
        return res.status(500).json({ error: 'Failed to initialize CDP Agent' });
      }
    }

    // Check vote threshold
    const VOTE_THRESHOLD = 2;
    if (voteCount < VOTE_THRESHOLD) {
      return res.status(400).json({
        success: false,
        message: `Meme needs at least ${VOTE_THRESHOLD} votes to mint NFT`
      });
    }

    // Get available actions
    const actions = agentKit.getActions();
    console.log('Available actions:', actions.map(a => a.name));
    
    // Get wallet details
    const walletDetailsAction = actions.find(a => a.name === 'WalletActionProvider_get_wallet_details');
    if (!walletDetailsAction) {
      throw new Error('Wallet details action not available');
    }
    
    const walletDetails = await walletDetailsAction.invoke({});
    console.log('CDP Agent wallet details:', walletDetails);

    // Request faucet funds if needed
    if (process.env.NETWORK_ID === 'base-sepolia') {
      const faucetAction = actions.find(a => a.name === 'CdpApiActionProvider_request_faucet_funds');
      if (faucetAction) {
        try {
          await faucetAction.invoke({ assetId: 'eth' });
          console.log('Requested faucet funds successfully');
        } catch (error) {
          console.warn('Failed to request faucet funds:', error);
        }
      }
    }

    // Use deploy contract action for interaction
    const deployContractAction = actions.find(a => a.name === 'CdpWalletActionProvider_deploy_contract');
    if (!deployContractAction) {
      throw new Error('Deploy contract action not available');
    }

    // Prepare the Solidity input JSON
    const solidityInput = {
      language: "Solidity",
      settings: {
        remappings: [],
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode"]
          }
        }
      },
      sources: {
        "ArtixNFT.sol": {
          content: `
            // SPDX-License-Identifier: MIT
            pragma solidity ^0.8.20;

            contract ArtixNFT {
                function mintMemeNFT(address creator, string memory tokenURI, uint8 network) public returns (uint256) {}
            }
          `
        }
      }
    };

    // Prepare contract deployment parameters
    const deployParams = {
      solidityVersion: "0.8.20",
      solidityInputJson: JSON.stringify(solidityInput),
      contractName: "ArtixNFT",
      constructorArgs: {},
      existingContractAddress: ARTIX_NFT_ADDRESS,
      functionName: "mintMemeNFT",
      functionArgs: {
        creator: memeMetadata.creator,
        tokenURI: memeMetadata.ipfsHash,
        network: "3"
      }
    };

    console.log('Attempting to mint NFT with params:', deployParams);

    // Execute NFT minting
    const mintTxHash = await deployContractAction.invoke(deployParams);
    console.log('Mint transaction hash:', mintTxHash);
    // const deployedContractAddress = 
    // const deployedContractLink = 

    // Extract contract address and transaction link from mintTxHash response
    const addressMatch = mintTxHash.match(/address (0x[a-fA-F0-9]{40})/);
    const linkMatch = mintTxHash.match(/(https:\/\/.*)/);
    
    const deployedContractAddress = addressMatch ? addressMatch[1] : null;
    const deployedContractLink = linkMatch ? linkMatch[1] : null;

    console.log('Deployed contract address:', deployedContractAddress);
    console.log('Transaction link:', deployedContractLink);

    // Post tweet about successful minting
    if (scraper) {
      try {
        
        console.log('mintTxHash', deployedContractAddress);
        console.log('ARTIX_NFT_ADDRESS', ARTIX_NFT_ADDRESS);
        console.log('shortenAddress(memeMetadata.creator)', shortenAddress(memeMetadata.creator));
        console.log('voteCount', voteCount);
        console.log('getOpenSeaUrl(ARTIX_NFT_ADDRESS, mintTxHash)', getOpenSeaUrl(ARTIX_NFT_ADDRESS, deployedContractAddress));
        
        // Extract Twitter username from social links
        const twitterUsername = memeMetadata.socialLinks?.includes('twitter.com/') || memeMetadata.socialLinks?.includes('x.com/') 
          ? '@' + memeMetadata.socialLinks.split('/').pop()
          : memeMetadata.socialLinks;

        const tweetContent = `🤖 Artix CDP Agent here! Just minted Meme #${memeId} as an NFT!\n\nCreator: ${shortenAddress(memeMetadata.creator)} ${twitterUsername}\nVotes: ${voteCount}\n\nContract Address: ${deployedContractAddress}\n\nTransaction Link: ${deployedContractLink}\n\nView on OpenSea: ${getOpenSeaUrl(ARTIX_NFT_ADDRESS, deployedContractAddress)}\n\n#ArtixNFT #Web3`;

        console.log('tweetContent', tweetContent);

        await scraper.sendTweet(tweetContent);
      } catch (tweetError) {
        console.warn('Failed to post NFT minting tweet:', tweetError);
      }
    }

    res.json({
      success: true,
      transactionHash: mintTxHash,
      message: 'NFT minting transaction submitted by CDP Agent',
      contractAddress: ARTIX_NFT_ADDRESS,
      agentAddress: walletDetails.address
    });

  } catch (error) {
    console.error('Error in CDP mint endpoint:', error);
    res.status(500).json({
      error: 'Failed to mint NFT using CDP Agent',
      details: error.message
    });
  }
});



// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', scraper: scraper ? 'initialized' : 'not initialized' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Twitter agent server running on port ${PORT}`);
  await Promise.all([
    initializeScraper(),
    initializeCDPAgent()
  ]);
});
