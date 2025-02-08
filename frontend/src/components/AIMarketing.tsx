import { useState } from 'react';
import axios from 'axios';

interface Meme {
  title: string;
  description: string;
  voteCount: number;
  creator: string;
  ipfsHash: string;
}

function AIMarketing({ meme }: { meme: Meme }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tweetText, setTweetText] = useState<string | null>(null);

  const postToTwitter = async () => {
    try {
      setLoading(true);
      setError(null);
      setTweetText(null);

      // Configure axios request based on working Postman setup
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const requestBody = {
        message: `Create a viral tweet about this meme: ${meme.title}`
      };

      const response = await axios.post(
        'https://autonome.alt.technology/artix-rweltv/chat',
        JSON.stringify(requestBody),
        config
      );

      if (response.data && response.data.message) {
        setTweetText(response.data.message);
        console.log('AI Generated Tweet:', response.data.message);
      } else {
        throw new Error('Invalid response from AI');
      }

    } catch (err) {
      console.error('Error posting to Twitter:', err);
      setError('Failed to generate tweet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={postToTwitter}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          loading ? 'bg-gray-400' : 'bg-[#1DA1F2] hover:bg-[#1a8cd8]'
        } text-white font-medium transition-colors`}
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
        {loading ? 'Generating Tweet...' : 'Generate Tweet'}
      </button>
      
      {error && (
        <span className="text-sm text-red-600">
          {error}
        </span>
      )}

      {tweetText && (
        <div className="mt-2 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-900 font-medium mb-2">Generated Tweet:</p>
          <p className="text-gray-600">{tweetText}</p>
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center text-sm text-[#1DA1F2] hover:underline"
          >
            Post this tweet
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

export default AIMarketing;