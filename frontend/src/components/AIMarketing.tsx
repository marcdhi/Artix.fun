import { useState } from 'react';
import axios from 'axios';
import { usePrivy } from '@privy-io/react-auth';

interface Meme {
  title: string;
  description: string;
  voteCount: number;
  creator: string;
  ipfsHash: string;
}

function AIMarketing({ meme }: { meme: Meme }) {
  const { user } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tweetText, setTweetText] = useState<string | null>(null);

  console.log(error)
  console.log(tweetText)

  // Check if current user is the creator
  const isCreator = user?.wallet?.address?.toLowerCase() === meme.creator.toLowerCase();

  if (!isCreator) return null;

  const postToTwitter = async () => {
    try {
      setLoading(true);
      setError(null);
      setTweetText(null);

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
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(response.data.message)}`, '_blank');
      } else {
        throw new Error('Invalid response from AI');
      }

    } catch (err) {
      console.error('Error posting to Twitter:', err);
      setError('Failed to generate tweet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={postToTwitter}
      disabled={loading}
      className={`p-2 rounded-full transition-opacity ${
        loading ? 'opacity-50' : 'opacity-100 hover:opacity-80'
      }`}
      title="Generate & Share on Twitter"
    >
      <svg className="w-5 h-5 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
      {loading && (
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg className="animate-spin h-4 w-4 text-[#1DA1F2]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      )}
    </button>
  );
}

export default AIMarketing;