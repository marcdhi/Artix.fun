import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import ArtifactRankingJSON from '../abi/ArtifactRanking.json';
import ArtifactMemeContestJSON from '../abi/ArtixMemeContest.json';
import ArtifactNFTJSON from '../abi/ArtifactNFT.json';

const ArtifactRankingABI = ArtifactRankingJSON;
const ArtifactMemeContestABI = ArtifactMemeContestJSON;
const ArtifactNFTABI = ArtifactNFTJSON;

const ARTIX_RANKING_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_RANKING_CONTRACT_ADDRESS;
const ARTIX_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_CONTRACT_ADDRESS;
const ARTIX_NFT_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_NFT_CONTRACT_ADDRESS;

// Base Sepolia network parameters
const BASE_SEPOLIA_PARAMS = {
  chainId: '0x' + Number(84532).toString(16),
  chainName: 'Base Sepolia',
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org']
};

// Rank level names (matching the contract)
const RANK_NAMES = [
  'Novice Memer',
  'Meme Enthusiast',
  'Meme Master',
  'Meme Legend',
  'Meme God'
];

interface UserRankingData {
  totalVotes: number;
  totalMemeSubmissions: number;
  currentRank: number;
  points: number;
}

interface UserStats {
  totalNFTsMinted: number;
  totalMemesSubmitted: number;
  totalVotesCast: number;
  winningMemes: number;
}

interface Meme {
  id: number;
  creator: string;
  ipfsHash: string;
  title: string;
  description: string;
  voteCount: number;
  hasBeenMinted: boolean;
  submissionTime: number;
}

interface VotedMeme {
  id: number;
  title: string;
  voteCount: number;
  creator: string;
  hasBeenMinted: boolean;
  ipfsHash: string;
}

const MyPage = () => {
  const { authenticated, login, user } = usePrivy();
  const { wallets } = useWallets();
  const [currentPage, setCurrentPage] = useState(1);
  const [isTwitterEnabled, setIsTwitterEnabled] = useState(true);
  const [isInstagramEnabled, setIsInstagramEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('voting');
  const [voteFilter, setVoteFilter] = useState<'highest' | 'lowest'>('highest');
  const [votingStatus, setVotingStatus] = useState<'voting' | 'minted' | 'closed'>('voting');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState<UserRankingData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userMemes, setUserMemes] = useState<Meme[]>([]);
  const [votedMemes, setVotedMemes] = useState<VotedMeme[]>([]);
  const ITEMS_PER_PAGE = 9;
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);

  // Add logging for state changes
  useEffect(() => {
    console.log('Loading state changed:', loading);
  }, [loading]);

  useEffect(() => {
    console.log('User stats updated:', userStats);
  }, [userStats]);

  useEffect(() => {
    console.log('Ranking data updated:', rankingData);
  }, [rankingData]);

  useEffect(() => {
    console.log('User memes updated:', userMemes);
  }, [userMemes]);

  // Add log function
  const addLog = (message: string) => {
    setLoadingLogs(prev => [...prev, message]);
  };

  // Get the authenticated wallet address
  const getAuthenticatedWallet = () => {
    if (!authenticated || !user?.wallet?.address) {
      console.log('No authenticated user or wallet address');
      return null;
    }
    const authWalletAddress = user.wallet.address;
    console.log('Auth wallet address:', authWalletAddress);

    const matchingWallet = wallets?.find(w => 
      w.address.toLowerCase() === authWalletAddress.toLowerCase()
    );

    if (matchingWallet) {
      console.log('Found matching wallet:', {
        type: matchingWallet.walletClientType,
        address: matchingWallet.address
      });
    } else {
      console.log('No matching wallet found');
    }

    return matchingWallet || null;
  };

  const activeWallet = getAuthenticatedWallet();

  const getIPFSGatewayURL = (ipfsHash: string) => {
    const hash = ipfsHash.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${hash}`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const fetchUserStats = async (address: string) => {
    addLog('Starting to fetch user stats...');
    const provider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_PARAMS.rpcUrls[0]);
    
    try {
      addLog('Creating contract instances...');
      const memeContract = new ethers.Contract(
        ARTIX_CONTRACT_ADDRESS,
        ArtifactMemeContestABI,
        provider
      );
      
      const nftContract = new ethers.Contract(
        ARTIX_NFT_CONTRACT_ADDRESS,
        ArtifactNFTABI,
        provider
      );

      console.log('Contract addresses:', {
        memeContract: ARTIX_CONTRACT_ADDRESS,
        nftContract: ARTIX_NFT_CONTRACT_ADDRESS
      });

      // 1. Get user's meme submissions
      console.log('Fetching user meme submissions...');
      const userMemes = [];
      let memeId = 0;
      const MAX_MEMES_TO_CHECK = 100;
      let emptyMemeCount = 0;
      
      while (memeId < MAX_MEMES_TO_CHECK) {
        try {
          const meme = await memeContract.memes(memeId);
          console.log(`Checking meme #${memeId}:`, {
            creator: meme.creator,
            matches: meme.creator.toLowerCase() === address.toLowerCase()
          });

          if (meme.creator === '0x0000000000000000000000000000000000000000' || meme.ipfsHash === '') {
            emptyMemeCount++;
            if (emptyMemeCount >= 3) {
              console.log('Found 3 empty memes in a row, stopping search');
              break;
            }
          } else if (meme.creator.toLowerCase() === address.toLowerCase()) {
            const memeData = {
              id: memeId,
              creator: meme.creator,
              ipfsHash: meme.ipfsHash,
              title: meme.title,
              description: meme.description,
              voteCount: meme.voteCount.toNumber(),
              hasBeenMinted: meme.hasBeenMinted,
              submissionTime: meme.submissionTime.toNumber()
            };
            console.log('Found user meme:', memeData);
            userMemes.push(memeData);
          }
          memeId++;
        } catch (e) {
          console.error(`Error fetching meme #${memeId}:`, e);
          break;
        }
      }

      console.log('Total user memes found:', userMemes.length);
      setUserMemes(userMemes);

      // 2. Get user's voted memes
      console.log('Fetching user voting history...');
      let totalVotes = 0;
      for (let i = 0; i < MAX_MEMES_TO_CHECK; i++) {
        try {
          const hasVoted = await memeContract.hasVoted(i, address);
          if (hasVoted) {
            console.log(`User has voted on meme #${i}`);
            totalVotes++;
          }
        } catch (e) {
          console.error(`Error checking vote for meme #${i}:`, e);
          break;
        }
      }
      console.log('Total votes cast:', totalVotes);

      // 3. Calculate winning memes
      console.log('Calculating winning memes...');
      const winningMemes = userMemes.filter(meme => 
        meme.voteCount >= 2 && meme.hasBeenMinted
      ).length;
      console.log('Total winning memes:', winningMemes);

      // 4. Get NFT balance
      console.log('Fetching NFT balance...');
      const nftBalance = await nftContract.balanceOf(address);
      console.log('NFT balance:', nftBalance.toNumber());

      const stats = {
        totalNFTsMinted: nftBalance.toNumber(),
        totalMemesSubmitted: userMemes.length,
        totalVotesCast: totalVotes,
        winningMemes
      };

      console.log('Setting user stats:', stats);
      setUserStats(stats);

      // Get voted memes
      addLog('Fetching voted memes...');
      const votedMemesList: VotedMeme[] = [];
      for (let i = 0; i < MAX_MEMES_TO_CHECK; i++) {
        try {
          const hasVoted = await memeContract.hasVoted(i, address);
          if (hasVoted) {
            const meme = await memeContract.memes(i);
            votedMemesList.push({
              id: i,
              title: meme.title,
              voteCount: meme.voteCount.toNumber(),
              creator: meme.creator,
              hasBeenMinted: meme.hasBeenMinted,
              ipfsHash: meme.ipfsHash
            });
          }
        } catch (e) {
          break;
        }
      }
      setVotedMemes(votedMemesList);

    } catch (err) {
      addLog('Error fetching user stats');
      throw err;
    }
  };

  const fetchUserRanking = async () => {
    if (!authenticated || !activeWallet?.address) {
      addLog('Waiting for wallet connection...');
      setLoading(false);
      return;
    }

    try {
      addLog('Starting to fetch user ranking...');
      setLoading(true);
      setError(null);

      const provider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_PARAMS.rpcUrls[0]);
      console.log('Provider connected:', await provider.getNetwork());

      const rankingContract = new ethers.Contract(
        ARTIX_RANKING_CONTRACT_ADDRESS,
        ArtifactRankingABI,
        provider
      );

      console.log('Ranking contract address:', ARTIX_RANKING_CONTRACT_ADDRESS);
      console.log('Using authenticated wallet address:', activeWallet.address);
      
      // Verify contract exists
      const code = await provider.getCode(ARTIX_RANKING_CONTRACT_ADDRESS);
      console.log('Contract exists:', code !== '0x');

      if (code === '0x') {
        throw new Error('Ranking contract not found at the specified address');
      }

      const data = await rankingContract.userRankings(activeWallet.address);
      console.log('Raw ranking data:', data);
      
      if (!data) {
        console.log('No ranking data found, initializing with defaults');
        setRankingData({
          totalVotes: 0,
          totalMemeSubmissions: 0,
          currentRank: 0,
          points: 0
        });
      } else {
        const rankingData = {
          totalVotes: data.totalVotes.toNumber(),
          totalMemeSubmissions: data.totalMemeSubmissions.toNumber(),
          currentRank: data.currentRank,
          points: data.points.toNumber()
        };
        console.log('Processed ranking data:', rankingData);
        setRankingData(rankingData);
      }

      console.log('Fetching additional user stats...');
      try {
        await fetchUserStats(activeWallet.address);
        console.log('User stats fetched successfully');
      } catch (statsError) {
        console.error('Error fetching user stats:', statsError);
        setError('Partial data loaded - some stats may be missing');
      }

    } catch (err) {
      addLog('Error fetching ranking data');
      console.error('Error fetching user ranking:', err);
      setError('Failed to fetch ranking data: ' + (err as Error).message);
      // Initialize with default data even on error
      setRankingData({
        totalVotes: 0,
        totalMemeSubmissions: 0,
        currentRank: 0,
        points: 0
      });
    } finally {
      console.log('Fetch completed, setting loading to false');
      setLoading(false);
    }
  };

  // Main effect for data fetching
  useEffect(() => {
    console.log('MyPage useEffect triggered', {
      authenticated,
      userWallet: user?.wallet?.address,
      activeWallet: activeWallet?.address,
      allWallets: wallets?.map(w => ({
        type: w.walletClientType,
        address: w.address
      }))
    });

    if (authenticated && activeWallet?.address) {
      fetchUserRanking();
    } else {
      setLoading(false);
    }
  }, [authenticated, user?.wallet?.address, activeWallet?.address, wallets]);

  const getFilteredMemes = () => {
    let filtered = [...userMemes];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(meme => 
        meme.title.toLowerCase().includes(query) ||
        meme.description.toLowerCase().includes(query)
      );
    }

    // Apply vote filter
    if (voteFilter === 'highest') {
      filtered.sort((a, b) => b.voteCount - a.voteCount);
    } else {
      filtered.sort((a, b) => a.voteCount - b.voteCount);
    }

    // Apply status filter
    switch (votingStatus) {
      case 'minted':
        filtered = filtered.filter(meme => meme.hasBeenMinted);
        break;
      case 'voting':
        filtered = filtered.filter(meme => !meme.hasBeenMinted && meme.voteCount < 2);
        break;
      case 'closed':
        filtered = filtered.filter(meme => !meme.hasBeenMinted && meme.voteCount >= 2);
        break;
    }

    return filtered;
  };

  const filteredMemes = getFilteredMemes();
  const totalPages = Math.ceil(filteredMemes.length / ITEMS_PER_PAGE);

  // Helper functions for ranking benefits and points
  const getRankBenefits = (rank: number) => {
    const benefits = [
      { rank: 0, benefits: ['Free usage of voted memes', 'Basic platform features'] },
      { rank: 1, benefits: ['Free usage of voted memes', 'Platform reward points', '5% voting power boost'] },
      { rank: 2, benefits: ['Free usage of voted memes', 'Platform reward points', '10% voting power boost', 'Whitelist eligibility for meme tokens'] },
      { rank: 3, benefits: ['Free usage of voted memes', 'Platform reward points', '15% voting power boost', 'Whitelist eligibility for meme tokens', 'Exclusive ranking NFT eligibility'] },
      { rank: 4, benefits: ['Free usage of voted memes', 'Platform reward points', '20% voting power boost', 'Whitelist eligibility for meme tokens', 'Exclusive ranking NFT eligibility', 'DAO governance rights'] }
    ];
    return benefits[rank].benefits;
  };

  const calculatePointsBreakdown = (rankingData: UserRankingData) => {
    return {
      votingPoints: rankingData.totalVotes * 10,
      submissionPoints: rankingData.totalMemeSubmissions * 50,
      rankBonus: rankingData.currentRank * 100,
      total: rankingData.points
    };
  };

  const getRankName = (rank: number) => {
    return RANK_NAMES[rank] || RANK_NAMES[0];
  };

  const calculateRankProgress = (rankingData: UserRankingData | null) => {
    if (!rankingData) return 0;
    const rankThresholds = [0, 10, 25, 50, 100]; // Match contract thresholds
    const currentRank = rankingData.currentRank;
    const nextRankThreshold = rankThresholds[currentRank + 1] || rankThresholds[currentRank];
    const currentRankThreshold = rankThresholds[currentRank];
    const progress = ((rankingData.totalVotes - currentRankThreshold) / 
      (nextRankThreshold - currentRankThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/60 mb-8">Connect your wallet to view your dashboard</p>
          <button
            onClick={() => login()}
            className="px-8 py-4 bg-[#FFD700] text-[#121212] rounded-full font-['Poppins'] font-medium hover:bg-[#FFD700]/90 transition-all"
          >
            connect wallet
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1A1A1A]/50 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <svg className="animate-spin h-8 w-8 text-[#FFD700]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-white/60">Loading your dashboard...</span>
            </div>
            
            <div className="space-y-2 font-mono text-sm">
              {loadingLogs.map((log, index) => (
                <div key={index} className="text-white/60">
                  {`> ${log}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 rounded-t-[120px] bg-gradient-to-b from-[#020B44] via-black to-black">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">{user?.wallet?.address?.slice(0, 6)}...</span>
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Current Rank Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Current rank: {rankingData ? getRankName(rankingData.currentRank) : 'Novice'}</h2>
          <p className="text-white/60 mb-4">Rank progress</p>
          {/* Rank Progress Bar */}
          <div className="relative h-2 bg-[#1A1A1A] rounded-full mb-2">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FFD700] to-[#FFD700]/60 rounded-full transition-all duration-300"
              style={{ width: `${calculateRankProgress(rankingData)}%` }}
            />
          </div>
          {/* Rank Labels */}
          <div className="flex justify-between text-sm">
            <span className={rankingData?.currentRank >= 0 ? 'text-[#FFD700]' : 'text-white/60'}>Novice</span>
            <span className={rankingData?.currentRank >= 1 ? 'text-[#FFD700]' : 'text-white/60'}>Enthusiast</span>
            <span className={rankingData?.currentRank >= 2 ? 'text-[#FFD700]' : 'text-white/60'}>Master</span>
            <span className={rankingData?.currentRank >= 3 ? 'text-[#FFD700]' : 'text-white/60'}>Legend</span>
            <span className={rankingData?.currentRank >= 4 ? 'text-[#FFD700]' : 'text-white/60'}>God</span>
          </div>
        </div>

        {/* Stats Grid with AI Marketing Card */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {/* Total Votes Card */}
          <div className="bg-[#1A1A1A]/50 rounded-xl p-6">
            <h3 className="text-lg text-white mb-4">Total votes</h3>
            <p className="text-3xl font-bold text-white mb-4">{userStats?.totalVotesCast || 0}</p>
          </div>

          {/* Total Memes Card */}
          <div className="bg-[#1A1A1A]/50 rounded-xl p-6">
            <h3 className="text-lg text-white mb-4">Total memes</h3>
            <p className="text-3xl font-bold text-white">{userStats?.totalMemesSubmitted || 0}</p>
          </div>

          {/* NFTs Minted Card */}
          <div className="bg-[#1A1A1A]/50 rounded-xl p-6">
            <h3 className="text-lg text-white mb-4">NFTs Minted</h3>
            <p className="text-3xl font-bold text-white">{userStats?.totalNFTsMinted || 0}</p>
          </div>

          {/* AI Marketing Card */}
          <div className="bg-[#1A1A1A]/50 rounded-xl p-6 relative overflow-hidden">
            {/* Status Indicator */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-sm text-white/60">Active</span>
            </div>

            {/* Role and Posts */}
            <h3 className="text-lg text-white mb-1">AI Marketing Agent</h3>
            <p className="text-white/60 mb-4">{userStats?.totalMemesSubmitted || 0} Posts</p>

            {/* Social Links with Toggle Buttons */}
            <div className="flex items-center gap-4 mb-4">
              {/* Twitter */}
              <div className="flex items-center gap-2">
                <label className="relative inline-block w-8 h-4">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isTwitterEnabled}
                    onChange={() => setIsTwitterEnabled(!isTwitterEnabled)}
                    aria-label="Toggle Twitter integration"
                  />
                  <div className={`absolute w-full h-full rounded-full transition-colors duration-200 ${
                    isTwitterEnabled ? 'border-1 border-[#FFD700] bg-black' : 'bg-black'
                  }`}></div>
                  <div className={`absolute w-3 h-3 bg-white rounded-full top-0.5 left-0.5 transition-transform duration-200 ${
                    isTwitterEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}></div>
                </label>
                <svg 
                  className={`w-4 h-4 transition-colors duration-200 ${
                    isTwitterEnabled ? 'text-[#FFD700]' : 'text-white/40'
                  }`} 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-2">
                <label className="relative inline-block w-8 h-4">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isInstagramEnabled}
                    onChange={() => setIsInstagramEnabled(!isInstagramEnabled)}
                    aria-label="Toggle Instagram integration"
                  />
                  <div className={`absolute w-full h-full rounded-full transition-colors duration-200 ${
                    isInstagramEnabled ? 'border-1 border-[#FFD700] bg-black' : 'bg-black'
                  }`}></div>
                  <div className={`absolute w-3 h-3 bg-white rounded-full top-0.5 left-0.5 transition-transform duration-200 ${
                    isInstagramEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}></div>
                </label>
                <svg 
                  className={`w-4 h-4 transition-colors duration-200 ${
                    isInstagramEnabled ? 'text-[#FFD700]' : 'text-white/40'
                  }`} 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </div>
            </div>

            {/* More Link */}
            <a href="#" className="text-[#FFD700] text-sm hover:text-[#FFD700]/80 transition-colors inline-flex items-center gap-1">
              More 
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Points & Benefits Section */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          {/* Points Section */}
          <div className="bg-[#1A1A1A]/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Points</h3>
            <div className="text-3xl font-bold text-[#FFD700] mb-4">
              {rankingData?.points || 0}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Voting Points</span>
                <span className="text-white">{rankingData ? calculatePointsBreakdown(rankingData).votingPoints : 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Submission Points</span>
                <span className="text-white">{rankingData ? calculatePointsBreakdown(rankingData).submissionPoints : 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Rank Bonus</span>
                <span className="text-white">{rankingData ? calculatePointsBreakdown(rankingData).rankBonus : 0}</span>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-[#1A1A1A]/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Rank Benefits</h3>
            <div className="space-y-3">
              {rankingData && getRankBenefits(rankingData.currentRank).map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 text-[#FFD700]">✓</div>
                  <p className="text-white/80">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-2 bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-4">
          {/* Left side - Filter options */}
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm">Votes</span>
            <button 
              onClick={() => setVoteFilter('highest')}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                voteFilter === 'highest' 
                  ? 'bg-black text-[#FFD700] border border-[#FFD700]' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              highest
            </button>
            <button 
              onClick={() => setVoteFilter('lowest')}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                voteFilter === 'lowest' 
                  ? 'bg-black text-[#FFD700] border border-[#FFD700]' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              lowest
            </button>
          </div>

          {/* Middle - Search bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search"
                className="w-full bg-[#1A1A1A] text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#FFD700] border border-white/10"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-white/40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Right side - Status filters */}
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm">Voting status</span>
            <button 
              onClick={() => setVotingStatus('voting')}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                votingStatus === 'voting' 
                  ? 'bg-black text-[#FFD700] border border-[#FFD700]' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              voting open
            </button>
            <button 
              onClick={() => setVotingStatus('minted')}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                votingStatus === 'minted' 
                  ? 'bg-black text-[#FFD700] border border-[#FFD700]' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              NFT minted
            </button>
            <button 
              onClick={() => setVotingStatus('closed')}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                votingStatus === 'closed' 
                  ? 'bg-black text-[#FFD700] border border-[#FFD700]' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              voting closed
            </button>
          </div>
        </div>

        {/* Meme Grid */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          {filteredMemes
            .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
            .map((meme) => (
            <div key={meme.id} className="group relative bg-black rounded-xl overflow-hidden">
              {/* Top Stats Bar */}
              <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-black/90 z-10">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-white/80">{meme.voteCount} votes</span>
                </div>

                {/* NFT Status */}
                {meme.hasBeenMinted && (
                  <div className="flex items-center gap-1.5 bg-black/80 px-2 py-1 rounded-full">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7L12 12L22 7L12 2Z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 17L12 22L22 17"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12L12 17L22 12"/>
                    </svg>
                    <span className="text-xs text-white">NFT minted</span>
                  </div>
                )}
              </div>

              {/* Meme Image */}
              <div className="aspect-square w-full">
                <img 
                  src={getIPFSGatewayURL(meme.ipfsHash)}
                  alt={meme.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white text-sm font-medium">{meme.title}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {!meme.hasBeenMinted && (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          <span className="text-xs text-white/60">voting open</span>
                        </>
                      )}
                    </div>
                  </div>
                  {meme.hasBeenMinted && (
                    <a 
                      href={`https://testnets.opensea.io/assets/base-sepolia/${ARTIX_CONTRACT_ADDRESS}/${meme.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFD700] text-xs hover:text-[#FFD700]/80 transition-colors"
                    >
                      View on OpenSea →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voting History Table */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold text-white mb-8">Your Voting History</h2>
          
          {/* Table */}
          <div className="w-full">
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
            <div className="space-y-4">
              {votedMemes.map((meme) => (
                <div key={meme.id} className="grid grid-cols-6 gap-4 py-4 px-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors">
                  {/* Meme Preview */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <img 
                        src={getIPFSGatewayURL(meme.ipfsHash)} 
                        alt={meme.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Vote Count */}
                  <div className="text-white/80 font-medium">
                    {meme.voteCount} / 100
                  </div>

                  {/* Title */}
                  <div className="text-white/80 truncate">
                    {meme.title}
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${meme.creator}`}
                        alt="Creator Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white/80">{formatAddress(meme.creator)}</span>
                  </div>

                  {/* Status */}
                  <div className="text-white/80">
                    {meme.hasBeenMinted ? (
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
                    {meme.hasBeenMinted ? (
                      <a 
                        href={`https://testnets.opensea.io/assets/base-sepolia/${ARTIX_CONTRACT_ADDRESS}/${meme.id}`}
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
          </div>
        </div>

        {/* Pagination */}
        {filteredMemes.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 text-sm transition-colors ${
                currentPage === 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/60 hover:text-white'
              }`}
            >
              ← Previous
            </button>
            {[...Array(totalPages)].map((_, idx) => (
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
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 text-sm transition-colors ${
                currentPage === totalPages 
                  ? 'text-white/20 cursor-not-allowed' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;