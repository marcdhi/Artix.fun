import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import ArtixMemeContestABI from '../abi/ArtixMemeContest.json';
// import ArtifactNFTABI from '../abi/ArtifactNFT.json';
import ArtifactRankingABI from '../abi/ArtifactRanking.json';
// import { uploadToPinata } from '../utils/pinata';
import AIMarketing from './AIMarketing';

const ARTIX_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_CONTRACT_ADDRESS;
// const ARTIX_NFT_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_NFT_CONTRACT_ADDRESS;
const ARTIX_RANKING_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_RANKING_CONTRACT_ADDRESS;
const CDP_AGENT_URL = import.meta.env.VITE_CDP_AGENT_URL;

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
  hasVoted?: boolean; // Whether current user has voted for this meme
}

interface VotingConfig {
  maxVotes: number;
  contestDuration: number;
  minVotesForWin: number;
  voteCost: ethers.BigNumber;
}

interface ConnectedWallet {
  address: string;
  walletClientType: string;
  getEthereumProvider: () => Promise<any>;
}

// interface Event {
//   event: string;
//   args: {
//     tokenId: { toString: () => string };
//     creator: string;
//     tokenURI: string;
//     network: number;
//   };
// }

function ExploreMemes() {
  const { authenticated, login, user } = usePrivy();
  const { wallets } = useWallets();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingConfig, setVotingConfig] = useState<VotingConfig | null>(null);
  const [votingStatus, setVotingStatus] = useState<{ [key: number]: 'loading' | 'success' | 'error' | null }>({});

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
      return matchingWallet as ConnectedWallet;
    }

    // If no matching wallet found but we have the auth address, return null instead of minimal wallet object
    return null;
  };

  const activeWallet = getAuthenticatedWallet();

  const switchToBaseSepolia = async (provider: any) => {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_PARAMS.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_SEPOLIA_PARAMS],
          });
        } catch (addError) {
          console.error('Error adding Base Sepolia network:', addError);
          throw new Error('Could not add Base Sepolia network to your wallet');
        }
      } else {
        console.error('Error switching to Base Sepolia:', switchError);
        throw new Error('Could not switch to Base Sepolia network');
      }
    }
  };

  const fetchVotingConfig = async (contract: ethers.Contract) => {
    try {
      const config = await contract.votingConfiguration();
      setVotingConfig({
        maxVotes: config.maxVotes.toNumber(),
        contestDuration: config.contestDuration.toNumber(),
        // minVotesForWin: config.minVotesForWin.toNumber(),
        minVotesForWin: 2,
        voteCost: config.voteCost
      });
    } catch (err) {
      console.error('Error fetching voting config:', err);
    }
  };

  const checkUserVotes = async (contract: ethers.Contract, memesList: Meme[], userAddress: string) => {
    console.log('Checking user votes for:', userAddress);
    
    try {
      const votedStatuses = await Promise.all(
        memesList.map(meme => contract.hasVoted(meme.id, userAddress))
      );
      
      return memesList.map((meme, index) => ({
        ...meme,
        hasVoted: votedStatuses[index]
      }));
    } catch (err) {
      console.error('Error checking user votes:', err);
      return memesList;
    }
  };

  const fetchMemes = async () => {
    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA_PARAMS.rpcUrls[0]);
      const contract = new ethers.Contract(
        ARTIX_CONTRACT_ADDRESS,
        ArtixMemeContestABI,
        provider
      );

      // Fetch voting configuration
      await fetchVotingConfig(contract);

      const memesList: Meme[] = [];
      let memeId = 0;
      const MAX_MEMES_TO_CHECK = 100;
      let emptyMemeCount = 0;
      
      console.log('Starting to fetch memes from blockchain...');
      
      while (memeId < MAX_MEMES_TO_CHECK) {
        try {
          const meme = await contract.memes(memeId);
          console.log(`Meme #${memeId} Data:`, {
            creator: meme.creator,
            ipfsHash: meme.ipfsHash,
            title: meme.title,
            description: meme.description,
            socialLinks: meme.socialLinks,
            networkId: meme.networkId.toString(),
            voteCount: meme.voteCount.toString(),
            submissionTime: meme.submissionTime.toString(),
            isActive: meme.isActive,
            hasBeenMinted: meme.hasBeenMinted,
            rawData: meme // Log the raw data as well
          });
          
          if (meme.creator === '0x0000000000000000000000000000000000000000' || meme.ipfsHash === '') {
            console.log(`Meme #${memeId} is empty, count: ${emptyMemeCount + 1}`);
            emptyMemeCount++;
            if (emptyMemeCount >= 3) break;
          } else {
            emptyMemeCount = 0;
            const memeData = {
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
            };
            console.log(`Processed Meme #${memeId}:`, memeData);
            memesList.push(memeData);
          }
          memeId++;
        } catch (e) {
          console.error(`Error fetching meme #${memeId}:`, e);
          break;
        }
      }

      // Check user's voted status if authenticated
      if (authenticated && activeWallet?.address) {
        console.log('Checking vote status for user:', activeWallet.address);
        const memesWithVoteStatus = await checkUserVotes(contract, memesList, activeWallet.address);
        console.log('Memes with vote status:', memesWithVoteStatus);
        setMemes(memesWithVoteStatus);
      } else {
        console.log('Setting memes without vote status:', memesList);
        setMemes(memesList);
      }

    } catch (err: any) {
      console.error('Error fetching memes:', err);
      setError(err.message || 'Error fetching memes');
    } finally {
      setLoading(false);
    }
  };

  const checkAndMintNFT = async (meme: Meme) => {
    console.log('Checking NFT minting conditions for meme:', {
      memeId: meme.id,
      voteCount: meme.voteCount,
      minVotesRequired: votingConfig?.minVotesForWin || 0,
      hasBeenMinted: meme.hasBeenMinted
    });

    if (!votingConfig) {
      console.warn('Voting config not available, cannot check minting conditions');
      return;
    }

    if (meme.hasBeenMinted) {
      console.log('Meme has already been minted as NFT');
      return;
    }

    if (meme.voteCount >= votingConfig.minVotesForWin) {
      console.log('Meme qualifies for NFT minting! Proceeding with CDP agent...');
      try {
        // Call CDP agent to mint NFT
        const response = await fetch(`${CDP_AGENT_URL}/api/cdp/check-and-mint`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            memeId: meme.id,
            voteCount: meme.voteCount,
            memeMetadata: {
              title: meme.title,
              description: meme.description,
              ipfsHash: meme.ipfsHash,
              creator: meme.creator,
              socialLinks: meme.socialLinks
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to mint NFT');
        }

        const data = await response.json();
        console.log('CDP Agent minting successful:', data);

        // TODO: Update meme status in backend database instead of on-chain
        // For now, just refresh to get latest state
        await fetchMemes();

        alert(`NFT minted successfully!\nTransaction Hash: ${data.transactionHash}\nToken ID: ${data.tokenId}\nView on OpenSea: ${getOpenSeaUrl(data.contractAddress, data.tokenId)}`);
      } catch (error: any) {
        console.error('Error with CDP agent:', error);
        alert('Failed to mint NFT: ' + (error.message || 'Unknown error'));
      }
    } else {
      console.log(`Meme needs ${votingConfig.minVotesForWin - meme.voteCount} more votes to qualify for NFT minting`);
    }
  };

  const voteMeme = async (memeId: number) => {
    if (!authenticated || !activeWallet?.address) {
      login();
      return;
    }

    try {
      setVotingStatus(prev => ({ ...prev, [memeId]: 'loading' }));

      const wallet = activeWallet as ConnectedWallet;
      if (!wallet.getEthereumProvider) {
        throw new Error('Wallet does not support Ethereum provider');
      }
      const provider = await wallet.getEthereumProvider();
      
      await switchToBaseSepolia(provider);

      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();
      
      // Vote on meme
      const memeContract = new ethers.Contract(
        ARTIX_CONTRACT_ADDRESS,
        ArtixMemeContestABI,
        signer
      );

      const voteCost = votingConfig?.voteCost || ethers.utils.parseEther("0.01");
      const voteTx = await memeContract.voteMeme(memeId, { value: voteCost });
      await voteTx.wait();

      // Update user's ranking
      console.log('Updating user ranking after vote...');
      const rankingContract = new ethers.Contract(
        ARTIX_RANKING_CONTRACT_ADDRESS,
        ArtifactRankingABI,
        signer
      );

      const rankingTx = await rankingContract.updateRanking(activeWallet.address, 1, false);
      await rankingTx.wait();
      console.log('Ranking updated successfully');

      // Refresh memes after successful vote
      await fetchMemes();
      setVotingStatus(prev => ({ ...prev, [memeId]: 'success' }));

      // After successful vote, check if meme should be minted
      const votedMeme = memes.find(m => m.id === memeId);
      if (votedMeme) {
        await checkAndMintNFT(votedMeme);
      }
    } catch (err: any) {
      console.error('Error voting:', err);
      setVotingStatus(prev => ({ ...prev, [memeId]: 'error' }));
      alert(err.message || 'Error voting for meme');
    }
  };

  useEffect(() => {
    console.log('ExploreMemes useEffect triggered', {
      authenticated,
      userWallet: user?.wallet?.address,
      activeWallet: activeWallet?.address,
      allWallets: wallets?.map(w => ({
        type: w.walletClientType,
        address: w.address
      }))
    });
    fetchMemes();
  }, [authenticated, user?.wallet?.address, activeWallet?.address]);

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

  const getOpenSeaUrl = (contractAddress: string, tokenId: string) => {
    return `https://testnets.opensea.io/assets/base_sepolia/${contractAddress}/${tokenId}`;
  };

  const getVoteButtonText = (meme: Meme, status: string | null) => {
    if (status === 'loading') return 'Voting...';
    if (status === 'success') return 'Voted!';
    if (status === 'error') return 'Failed - Try Again';
    if (meme.hasVoted) return 'Already Voted';
    return `Vote (${ethers.utils.formatEther(votingConfig?.voteCost || '0')} ETH)`;
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
          
          {/* Voting Configuration Info */}
          {votingConfig && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Contest Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Vote Cost</p>
                  <p className="font-medium text-gray-900">{ethers.utils.formatEther(votingConfig.voteCost)} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Max Votes</p>
                  <p className="font-medium text-gray-900">{votingConfig.maxVotes}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contest Duration</p>
                  <p className="font-medium text-gray-900">{votingConfig.contestDuration / 86400} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Min Votes to Win</p>
                  <p className="font-medium text-gray-900">{votingConfig.minVotesForWin}</p>
                </div>
              </div>
            </div>
          )}
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
                    <div className="flex items-center gap-4">
                      <a
                        href={meme.socialLinks}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Social Links
                      </a>
                      <button
                        onClick={() => voteMeme(meme.id)}
                        disabled={!authenticated || meme.hasVoted || votingStatus[meme.id] === 'loading'}
                        className={`px-4 py-2 text-sm font-medium rounded ${
                          !authenticated || meme.hasVoted
                            ? 'bg-gray-100 text-gray-500'
                            : votingStatus[meme.id] === 'success'
                            ? 'bg-green-500 text-white'
                            : votingStatus[meme.id] === 'error'
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {getVoteButtonText(meme, votingStatus[meme.id])}
                      </button>
                      
                      {/* Add AI Marketing Section */}
                      {meme.voteCount >= (votingConfig?.minVotesForWin || 0) && (
                        <div className="mt-4">
                          <AIMarketing meme={meme} />
                        </div>
                      )}
                    </div>
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