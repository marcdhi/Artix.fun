import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import ArtixMemeContestABI from '../abi/ArtixMemeContest.json';
import ArtifactRankingABI from '../abi/ArtifactRanking.json';
import AIMarketing from './AIMarketing';

const ARTIX_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_CONTRACT_ADDRESS;
const ARTIX_RANKING_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_RANKING_CONTRACT_ADDRESS;

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
  description: string;
  socialLinks: string;
  networkId: number;
  voteCount: number;
  submissionTime: number;
  isActive: boolean;
  hasBeenMinted: boolean;
  hasVoted?: boolean;
}

function MemeDetails() {
  const { id } = useParams();
  const { authenticated, login, user } = usePrivy();
  const { wallets } = useWallets();
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingStatus, setVotingStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [trendingMemes, setTrendingMemes] = useState<Meme[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;
  const [loadingTrending, setLoadingTrending] = useState(true);

  const getIPFSGatewayURL = (ipfsHash: string) => {
    const hash = ipfsHash.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${hash}`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const fetchMeme = async () => {
    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_PARAMS.rpcUrls[0]);
      const contract = new ethers.Contract(
        ARTIX_CONTRACT_ADDRESS,
        ArtixMemeContestABI,
        provider
      );

      const memeData = await contract.memes(id);
      
      if (memeData.creator === '0x0000000000000000000000000000000000000000') {
        throw new Error('Meme not found');
      }

      const memeObj = {
        id: Number(id),
        creator: memeData.creator,
        ipfsHash: memeData.ipfsHash,
        title: memeData.title,
        description: memeData.description,
        socialLinks: memeData.socialLinks,
        networkId: memeData.networkId.toNumber(),
        voteCount: memeData.voteCount.toNumber(),
        submissionTime: memeData.submissionTime.toNumber(),
        isActive: memeData.isActive,
        hasBeenMinted: memeData.hasBeenMinted
      };

      // Check if user has voted if authenticated
      if (authenticated && user?.wallet?.address) {
        const hasVoted = await contract.hasVoted(id, user.wallet.address);
        memeObj.hasVoted = hasVoted;
      }

      setMeme(memeObj);
    } catch (err) {
      console.error('Error fetching meme:', err);
      setError('Failed to load meme details');
    } finally {
      setLoading(false);
    }
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
    fetchMeme();
    fetchTrendingMemes();
  }, [id, authenticated, user?.wallet?.address]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white/70 text-lg font-['Poppins']">Loading meme...</div>
      </div>
    );
  }

  if (error || !meme) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Meme not found'}</p>
        <Link 
          to="/explore" 
          className="text-white/60 hover:text-white transition-colors"
        >
          ← Back to explore
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link 
          to="/explore"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-['Poppins']"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          go to explore
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 gap-16">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-[#1A1A1A]">
              <img 
                src={getIPFSGatewayURL(meme.ipfsHash)} 
                alt={meme.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            {/* Stats Row */}
            <div className="flex items-center gap-4">
              {/* Vote Count */}
              <div className="bg-[#1A1A1A] rounded-2xl px-6 py-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <span className="text-white text-lg font-semibold">{meme.voteCount}</span>
                </div>
                <span className="text-white/60 text-sm">votes</span>
              </div>

              {/* Voting Status */}
              <div className="bg-[#1A1A1A] rounded-2xl px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${meme.isActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-white text-lg font-semibold">
                    {meme.isActive ? 'Voting Open' : 'Voting Closed'}
                  </span>
                </div>
                <span className="text-white/60 text-sm">status</span>
              </div>

              {/* NFT Status */}
              {meme.hasBeenMinted && (
                <div className="bg-[#1A1A1A] rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="text-[#FFD700] text-lg font-semibold">NFT Minted</span>
                  </div>
                  <span className="text-white/60 text-sm">status</span>
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1A1A1A] overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${meme.creator}`}
                  alt="Creator Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold font-['Poppins']">
                  {formatAddress(meme.creator)}
                </h3>
                <span className="text-white/60 text-sm">creator</span>
              </div>
            </div>

            {/* Meme Info */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white font-['Poppins']">
                {meme.title}
              </h1>
              
              <p className="text-white/60 text-lg font-['Poppins']">
                {meme.description}
              </p>

              {meme.socialLinks && (
                <a 
                  href={meme.socialLinks}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FFD700] hover:text-[#FFD700]/80 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>View on Twitter</span>
                </a>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {/* voteMeme function */}}
                disabled={!authenticated || meme.hasVoted || votingStatus === 'loading'}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-['Poppins'] font-medium transition-all ${
                  !authenticated || meme.hasVoted || votingStatus === 'loading'
                    ? 'bg-[#1A1A1A]/50 text-white/60'
                    : 'bg-[#FFD700] text-[#121212] hover:bg-[#FFD700]/90'
                }`}
              >
                {votingStatus === 'loading' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Voting...</span>
                  </>
                ) : meme.hasVoted ? (
                  'Already Voted'
                ) : (
                  'Vote'
                )}
              </button>

              {meme.voteCount >= 2 && (
                <AIMarketing meme={meme} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trends Section */}
      <div className="max-w-7xl mx-auto px-4 mt-20 mb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white font-['Poppins']">Voting Status</h2>
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

export default MemeDetails; 