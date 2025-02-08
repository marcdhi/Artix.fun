import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import ArtifactRankingJSON from '../abi/ArtifactRanking.json';
import ArtifactMemeContestJSON from '../abi/ArtixMemeContest.json';
import ArtifactNFTJSON from '../abi/ArtifactNFT.json';

// Extract ABIs from the JSON files
const ArtifactRankingABI = ArtifactRankingJSON
const ArtifactMemeContestABI = ArtifactMemeContestJSON
const ArtifactNFTABI = ArtifactNFTJSON 

if (!ArtifactRankingABI || !ArtifactMemeContestABI || !ArtifactNFTABI) {
  throw new Error('Failed to load contract ABIs');
}

const ARTIX_RANKING_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_RANKING_CONTRACT_ADDRESS;
const ARTIX_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_CONTRACT_ADDRESS;
const ARTIX_NFT_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_NFT_CONTRACT_ADDRESS;

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

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

function UserRanking() {
  const { authenticated, login, user } = usePrivy();
  const { wallets } = useWallets();
  const [rankingData, setRankingData] = useState<UserRankingData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the authenticated wallet address
  const getAuthenticatedWallet = () => {
    if (!authenticated || !user?.wallet?.address) return null;

    // First check if we have the user's authenticated wallet address
    const authWalletAddress = user.wallet.address;
    console.log('Auth wallet address:', authWalletAddress);

    // Find the matching wallet from wallets list
    const matchingWallet = wallets?.find(w => 
      w.address.toLowerCase() === authWalletAddress.toLowerCase()
    );

    if (matchingWallet) {
      console.log('Found matching wallet:', {
        type: matchingWallet.walletClientType,
        address: matchingWallet.address
      });
      return matchingWallet;
    }

    // If no matching wallet found but we have the auth address, create a minimal wallet object
    return {
      address: authWalletAddress,
      walletClientType: 'privy'
    };
  };

  const activeWallet = getAuthenticatedWallet();

  const fetchUserStats = async (address: string) => {
    const provider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_PARAMS.rpcUrls[0]);
    
    // Create contract instances
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

    try {
      console.log('Fetching stats for address:', address);

      // 1. Get user's meme submissions
      const userMemes = [];
      let memeId = 0;
      const MAX_MEMES_TO_CHECK = 100;
      
      while (memeId < MAX_MEMES_TO_CHECK) {
        try {
          const meme = await memeContract.memes(memeId);
          if (meme.creator === address) {
            userMemes.push(meme);
          }
          memeId++;
        } catch (e) {
          break;
        }
      }

      // 2. Get user's voted memes
      let totalVotes = 0;
      const votedMemes = [];
      
      // Check votes for each meme
      for (let i = 0; i < MAX_MEMES_TO_CHECK; i++) {
        try {
          const hasVoted = await memeContract.hasVoted(i, address);
          if (hasVoted) {
            totalVotes++;
            votedMemes.push(i);
          }
        } catch (e) {
          break;
        }
      }

      console.log('User voting data:', {
        totalVotes,
        votedMemes
      });

      // 3. Calculate winning memes (memes with enough votes and minted as NFT)
      const winningMemes = userMemes.filter(meme => 
        meme.voteCount >= 2 && meme.hasBeenMinted
      ).length;

      // 4. Get NFT balance
      const nftBalance = await nftContract.balanceOf(address);

      console.log('User stats:', {
        totalNFTsMinted: nftBalance.toNumber(),
        totalMemesSubmitted: userMemes.length,
        totalVotesCast: totalVotes,
        winningMemes,
        votedMemeIds: votedMemes
      });

      setUserStats({
        totalNFTsMinted: nftBalance.toNumber(),
        totalMemesSubmitted: userMemes.length,
        totalVotesCast: totalVotes,
        winningMemes
      });

    } catch (err) {
      console.error('Error fetching user stats:', err);
      throw err; // Propagate error to be handled by caller
    }
  };

  const fetchUserRanking = async () => {
    if (!authenticated || !activeWallet?.address) {
      console.log('User not authenticated or no active wallet', {
        authenticated,
        userWallet: user?.wallet?.address,
        activeWallet: activeWallet?.address
      });
      setLoading(false);
      return;
    }

    try {
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

      // Get user's ranking data
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
        const rankingData: UserRankingData = {
          totalVotes: data.totalVotes.toNumber(),
          totalMemeSubmissions: data.totalMemeSubmissions.toNumber(),
          currentRank: data.currentRank,
          points: data.points.toNumber()
        };

        console.log('Processed ranking data:', rankingData);
        setRankingData(rankingData);
      }

      // Fetch additional user stats
      try {
        await fetchUserStats(activeWallet.address);
      } catch (statsError) {
        console.error('Error fetching user stats:', statsError);
        setError('Partial data loaded - some stats may be missing');
      }

    } catch (err) {
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

  useEffect(() => {
    console.log('UserRanking useEffect triggered', {
      authenticated,
      userWallet: user?.wallet?.address,
      activeWallet: activeWallet?.address,
      allWallets: wallets?.map(w => ({
        type: w.walletClientType,
        address: w.address
      }))
    });
    fetchUserRanking();
  }, [authenticated, user?.wallet?.address, activeWallet?.address]);

  // Add loading state logging
  useEffect(() => {
    console.log('Loading state changed:', loading);
  }, [loading]);

  // Add ranking data logging
  useEffect(() => {
    console.log('Ranking data updated:', rankingData);
  }, [rankingData]);

  if (!authenticated || !activeWallet?.address) {
    return (
      <div className="min-h-[300px] bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">View Your Ranking</h2>
        <p className="text-gray-600 mb-6">Connect your wallet to view your ranking and achievements</p>
        <button
          onClick={login}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loading && !rankingData) {
    return (
      <div className="min-h-[300px] bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
        <p className="text-gray-600">Loading ranking data...</p>
      </div>
    );
  }

  if (error && !rankingData) {
    return (
      <div className="min-h-[300px] bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!rankingData) {
    return (
      <div className="min-h-[300px] bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
        <p className="text-gray-600">No ranking data found</p>
      </div>
    );
  }

  const calculateRankProgress = (rankingData: UserRankingData) => {
    const rankThresholds = [0, 10, 25, 50, 100]; // Match contract thresholds
    const currentRank = rankingData.currentRank;
    const nextRankThreshold = rankThresholds[currentRank + 1] || rankThresholds[currentRank];
    const currentRankThreshold = rankThresholds[currentRank];
    const progress = ((rankingData.totalVotes - currentRankThreshold) / 
      (nextRankThreshold - currentRankThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

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

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Meme Ranking</h2>
        <p className="text-gray-600">Track your progress and achievements in the meme community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rank Card */}
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Current Rank</h3>
          <div className="text-3xl font-bold mb-2">
            {RANK_NAMES[rankingData.currentRank]}
          </div>
          <p className="text-purple-100">
            Level {rankingData.currentRank + 1} Memer
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Total Votes Cast</h4>
            <p className="text-2xl font-bold text-gray-900">{userStats?.totalVotesCast || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Memes Submitted</h4>
            <p className="text-2xl font-bold text-gray-900">{userStats?.totalMemesSubmitted || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">NFTs Minted</h4>
            <p className="text-2xl font-bold text-gray-900">{userStats?.totalNFTsMinted || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Winning Memes</h4>
            <p className="text-2xl font-bold text-gray-900">{userStats?.winningMemes || 0}</p>
          </div>
        </div>
      </div>

      {/* Rank Progress */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rank Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{ 
              width: `${calculateRankProgress(rankingData)}%`
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          {RANK_NAMES.map((rank, index) => (
            <span key={rank} className={rankingData.currentRank >= index ? 'text-blue-600 font-medium' : ''}>
              {rank.split(' ')[1]}
            </span>
          ))}
        </div>
      </div>

      {/* Points & Benefits */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Points Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Points</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {rankingData.points}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Voting Points</span>
                <span className="text-gray-900">{calculatePointsBreakdown(rankingData).votingPoints}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Submission Points</span>
                <span className="text-gray-900">{calculatePointsBreakdown(rankingData).submissionPoints}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rank Bonus</span>
                <span className="text-gray-900">{calculatePointsBreakdown(rankingData).rankBonus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rank Benefits</h3>
          <div className="space-y-3">
            {getRankBenefits(rankingData.currentRank).map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 text-green-500">✓</div>
                <p className="text-gray-600">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRanking; 