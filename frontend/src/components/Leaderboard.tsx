import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import ArtixMemeContestABI from '../abi/ArtixMemeContest.json';

const ARTIX_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_CONTRACT_ADDRESS;

// Base Sepolia network parameters
const BASE_SEPOLIA_PARAMS = {
  chainId: '0x' + Number(84532).toString(16),
  chainName: 'Base Sepolia',
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org']
};

interface Meme {
  id: number;
  creator: string;
  ipfsHash: string;
  title: string;
  voteCount: number;
  hasBeenMinted: boolean;
}

function Leaderboard() {
  const [trendingMemes, setTrendingMemes] = useState<Meme[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const ITEMS_PER_PAGE = 7;

  const getIPFSGatewayURL = (ipfsHash: string) => {
    const hash = ipfsHash.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${hash}`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const fetchTrendingMemes = async () => {
    try {
      setLoadingTrending(true);
      const provider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_PARAMS.rpcUrls[0]);
      const contract = new ethers.Contract(
        ARTIX_CONTRACT_ADDRESS,
        ArtixMemeContestABI,
        provider
      );

      const memesList: Meme[] = [];
      let memeId = 0;
      const MAX_MEMES_TO_CHECK = 100;
      let emptyMemeCount = 0;

      while (memeId < MAX_MEMES_TO_CHECK) {
        try {
          const meme = await contract.memes(memeId);
          if (meme.creator === '0x0000000000000000000000000000000000000000' || meme.ipfsHash === '') {
            emptyMemeCount++;
            if (emptyMemeCount >= 3) break;
          } else {
            const memeData = {
              id: memeId,
              creator: meme.creator,
              ipfsHash: meme.ipfsHash,
              title: meme.title,
              voteCount: meme.voteCount.toNumber(),
              hasBeenMinted: meme.hasBeenMinted
            };
            memesList.push(memeData);
          }
          memeId++;
        } catch (e) {
          console.error(`Error fetching meme #${memeId}:`, e);
          break;
        }
      }

      // Sort by vote count
      const sortedMemes = memesList.sort((a, b) => b.voteCount - a.voteCount);
      setTrendingMemes(sortedMemes);
    } catch (err) {
      console.error('Error fetching trending memes:', err);
    } finally {
      setLoadingTrending(false);
    }
  };

  useEffect(() => {
    fetchTrendingMemes();
  }, []);

  return (
    <div className="min-h-screen mt-22">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white font-['Poppins']">Leaderboard</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Next →
            </button>
          </div>
        </div>

        {loadingTrending ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-8 w-8 text-[#FFD700]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-white/60 text-sm">Loading trending memes...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 text-sm text-white/60 mb-4 px-4 border-b border-white/10 pb-4">
              <div>meme</div>
              <div>votes</div>
              <div>title</div>
              <div>creator</div>
              <div>status</div>
              <div>voting transaction</div>
            </div>

            {/* Table Content */}
            <div className="space-y-6">
              {trendingMemes
                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                .map((trendingMeme) => (
                <div key={trendingMeme.id} className="grid grid-cols-6 gap-4 py-4 px-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors">
                  {/* Meme Preview */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <img 
                        src={getIPFSGatewayURL(trendingMeme.ipfsHash)} 
                        alt={trendingMeme.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Vote Count */}
                  <div className="text-white/80 font-medium">
                    {trendingMeme.voteCount} / 100
                  </div>

                  {/* Title */}
                  <div className="text-white/80 truncate">
                    {trendingMeme.title}
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${trendingMeme.creator}`}
                        alt="Creator Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white/80">{formatAddress(trendingMeme.creator)}</span>
                  </div>

                  {/* Status */}
                  <div className="text-white/80">
                    {trendingMeme.hasBeenMinted ? (
                      <span className="text-[#FFD700]">minted</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span>voting open</span>
                      </div>
                    )}
                  </div>

                  {/* Transaction */}
                  <div>
                    {trendingMeme.hasBeenMinted ? (
                      <a 
                        href={`https://testnets.opensea.io/assets/base-sepolia/${ARTIX_CONTRACT_ADDRESS}/${trendingMeme.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FFD700] hover:text-[#FFD700]/80 transition-colors text-sm"
                      >
                        OpenSea →
                      </a>
                    ) : (
                      <span className="text-white/40">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 text-sm transition-colors ${
                  currentPage === 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:text-white'
                }`}
              >
                ← Previous
              </button>
              {[...Array(Math.ceil(trendingMemes.length / ITEMS_PER_PAGE))].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    currentPage === idx + 1 
                      ? 'text-[#FFD700] border border-[#FFD700]' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(trendingMemes.length / ITEMS_PER_PAGE), p + 1))}
                disabled={currentPage === Math.ceil(trendingMemes.length / ITEMS_PER_PAGE)}
                className={`p-2 text-sm transition-colors ${
                  currentPage === Math.ceil(trendingMemes.length / ITEMS_PER_PAGE) 
                    ? 'text-white/20 cursor-not-allowed' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Leaderboard; 