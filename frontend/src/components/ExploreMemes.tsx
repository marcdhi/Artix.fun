import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import ArtixMemeContestABI from '../abi/ArtixMemeContest.json';

const ARTIX_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_CONTRACT_ADDRESS;

// Base Sepolia network parameters
const BASE_SEPOLIA_PARAMS = {
  chainId: '0x' + Number(84532).toString(16),
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org']
};

interface Meme {
  id: number;
  creator: string;
  ipfsHash: string;
  title: string;
  description: string;
  socialLinks: string;
  networkId: number;
  voteCount: number;
  submissionTime: number;
  isActive: boolean;
  hasBeenMinted: boolean;
}

function ExploreMemes() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get provider
      const provider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_PARAMS.rpcUrls[0]);
      
      // Create contract instance
      const contract = new ethers.Contract(
        ARTIX_CONTRACT_ADDRESS,
        ArtixMemeContestABI,
        provider
      );

      // Get total memes count (we'll need to add this to the contract)
      const memesList: Meme[] = [];
      let memeId = 0;
      const MAX_MEMES_TO_CHECK = 100; // Maximum number of memes to check
      let emptyMemeCount = 0; // Counter for consecutive empty memes
      
      // Keep trying to fetch memes until we hit an error or reach max limit
      while (memeId < MAX_MEMES_TO_CHECK) {
        try {
          const meme = await contract.memes(memeId);
          console.log(meme);
          
          // Check if this is an empty meme
          if (meme.creator === '0x0000000000000000000000000000000000000000' || meme.ipfsHash === '') {
            emptyMemeCount++;
            // If we find 3 consecutive empty memes, we can assume we've reached the end
            if (emptyMemeCount >= 3) {
              break;
            }
          } else {
            // Reset empty meme counter if we find a valid meme
            emptyMemeCount = 0;
            // Add the valid meme to our list
            memesList.push({
              id: memeId,
              creator: meme.creator,
              ipfsHash: meme.ipfsHash,
              title: meme.title,
              description: meme.description,
              socialLinks: meme.socialLinks,
              networkId: meme.networkId.toNumber(),
              voteCount: meme.voteCount.toNumber(),
              submissionTime: meme.submissionTime.toNumber(),
              isActive: meme.isActive,
              hasBeenMinted: meme.hasBeenMinted
            });
          }
          memeId++;
        } catch (e) {
          // If we hit an error, we've probably reached the end
          break;
        }
      }

      setMemes(memesList);
      console.log(memesList);
    } catch (err: any) {
      console.error('Error fetching memes:', err);
      setError(err.message || 'Error fetching memes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
    // console.log(memes);
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getIPFSGatewayURL = (ipfsHash: string) => {
    const hash = ipfsHash.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${hash}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-[32px] font-bold text-gray-900 mb-2">
            Explore Memes
          </h1>
          <p className="text-base text-gray-600">
            Discover and vote for the best memes
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading memes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : memes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No memes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <div key={meme.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={getIPFSGatewayURL(meme.ipfsHash)}
                    alt={meme.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{meme.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{meme.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By: {formatAddress(meme.creator)}</span>
                    <span>{formatDate(meme.submissionTime)}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Votes: {meme.voteCount}</span>
                    <a
                      href={meme.socialLinks}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Social Links
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExploreMemes; 