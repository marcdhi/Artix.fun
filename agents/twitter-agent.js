const express = require('express');
const { Scraper } = require('agent-twitter-client');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
app.use(express.json());

// Initialize Twitter scraper and Claude
let scraper = null;
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', scraper: scraper ? 'initialized' : 'not initialized' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Twitter agent server running on port ${PORT}`);
  await initializeScraper();
});
