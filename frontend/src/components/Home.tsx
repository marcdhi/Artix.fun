import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ArtixMemeContestABI from '../abi/ArtixMemeContest.json';

const ARTIX_CONTRACT_ADDRESS = import.meta.env.VITE_ARTIX_CONTRACT_ADDRESS;

// Base Sepolia network parameters
const BASE_SEPOLIA_PARAMS = {
  chainId: '0x' + Number(84532).toString(16),
  chainName: 'Base Sepolia',
  rpcUrls: ['https://sepolia.base.org'],
};

interface Meme {
  id: number;
  creator: string;
  ipfsHash: string;
  title: string;
  voteCount: number;
  hasBeenMinted: boolean;
}

const Home = () => {
  const [activeFilter, setActiveFilter] = useState<'top rated' | 'new'>('top rated');
  const [activeStatus, setActiveStatus] = useState<'voting open' | 'NFT minted' | 'voting closed'>('voting open');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 68;
  const [topMemes, setTopMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  const getIPFSGatewayURL = (ipfsHash: string) => {
    const hash = ipfsHash.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${hash}`;
  };

  const fetchTopMemes = async () => {
    try {
      setLoading(true);
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

      // Sort memes by vote count and get top 3
      const sortedMemes = memesList.sort((a, b) => b.voteCount - a.voteCount).slice(0, 3);
      setTopMemes(sortedMemes);
    } catch (err) {
      console.error('Error fetching top memes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopMemes();
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    
    // Always show first page
    pages.push(
      <button 
        key={1}
        onClick={() => handlePageChange(1)}
        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
          currentPage === 1 
            ? 'bg-yellow-400 text-black' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        1
      </button>
    );

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);

    if (startPage > 2) {
      pages.push(
        <span key="ellipsis1" className="w-8 h-8 flex items-center justify-center text-gray-400">
          ...
        </span>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
            currentPage === i 
              ? 'bg-yellow-400 text-black' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      pages.push(
        <span key="ellipsis2" className="w-8 h-8 flex items-center justify-center text-gray-400">
          ...
        </span>
      );
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
            currentPage === totalPages 
              ? 'bg-yellow-400 text-black' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="relative min-h-screen bg-[#121212]">
      {/* Main gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#010EFB] via-transparent to-transparent" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="pt-40 pb-24">
          <h3 className="text-[#FFD700] text-xl font-medium mb-4 font-['Poppins'] tracking-wide">
            Artix.fun
          </h3>
          <h1 className="text-[86px] font-bold mb-6 font-['Poppins'] text-white leading-tight">
            Meme Contest<br/>DAO Platform
          </h1>
          <p className="text-white/80 text-xl mb-10 font-['Poppins'] font-regular max-w-xl">
            Own, Vote & Earn from Memes on the Blockchain!
          </p>
          <Link
            to="/create"
            className="inline-flex items-center bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#121212] px-8 py-3 rounded-full text-base font-semibold font-['Poppins'] transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            + create
          </Link>
        </div>

        {/* Best of Memes Section */}
        <div className="mb-40">
          <h2 className="text-5xl font-bold text-center mb-20 font-['Poppins'] text-white">Best of Memes</h2>
          {loading ? (
            <div className="flex justify-center items-center h-[420px]">
              <div className="text-white/70 text-lg font-['Poppins']">Loading top memes...</div>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-8 relative px-4">
              {/* Second Place */}
              {topMemes[1] && (
                <div className="relative w-[320px] h-[420px] mt-12 group">
                  {/* Position Badge */}
                  <div className="absolute -top-8 right-6 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#010EFB] rounded-full shadow-lg blur-sm opacity-50"></div>
                      <div className="relative w-16 h-16 bg-[#010EFB] rounded-full shadow-lg flex items-center justify-center">
                        <span className="text-[#FFD700] text-5xl font-bold font-['Poppins'] drop-shadow-lg">2</span>
                      </div>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="relative h-full rounded-[24px] overflow-hidden group-hover:scale-[1.02] transition-all duration-300 shadow-xl bg-[#1A1A1A]">
                    {/* Image Container with Gradient Overlay */}
                    <div className="relative h-full">
                      <img 
                        src={getIPFSGatewayURL(topMemes[1].ipfsHash)}
                        alt={topMemes[1].title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0">
                      <div className="p-6 bg-[#121212]/95 backdrop-blur-md border-b-2 border-[#FFD700] rounded-b-[24px]">
                        <h3 className="text-white text-lg font-semibold font-['Poppins'] mb-3 line-clamp-1">{topMemes[1].title}</h3>
                        <div className="flex items-center gap-4">
                          {/* Vote count with user icon */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-white/90 font-['Poppins'] font-medium">{topMemes[1].voteCount}</span>
                          </div>
                          {/* NFT Minted */}
                          {topMemes[1].hasBeenMinted && (
                            <div className="flex items-center gap-2 bg-[#FFD700]/10 px-3 py-1 rounded-full">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className="text-[#FFD700] font-['Poppins'] text-sm">NFT</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* First Place - Larger */}
              {topMemes[0] && (
                <div className="relative w-[360px] h-[480px] -mt-8 group z-10">
                  {/* Position Badge */}
                  <div className="absolute -top-8 right-6 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#010EFB] rounded-full shadow-lg blur-sm opacity-50"></div>
                      <div className="relative w-20 h-20 bg-[#010EFB] rounded-full shadow-lg flex items-center justify-center">
                        <span className="text-[#FFD700] text-6xl font-bold font-['Poppins'] drop-shadow-lg">1</span>
                      </div>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="relative h-full rounded-[24px] overflow-hidden group-hover:scale-[1.02] transition-all duration-300 shadow-2xl bg-[#1A1A1A]">
                    {/* Image Container with Gradient Overlay */}
                    <div className="relative h-full">
                      <img 
                        src={getIPFSGatewayURL(topMemes[0].ipfsHash)}
                        alt={topMemes[0].title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0">
                      <div className="p-6 bg-[#121212]/95 backdrop-blur-md border-b-2 border-[#FFD700] rounded-b-[24px]">
                        <h3 className="text-white text-xl font-semibold font-['Poppins'] mb-3 line-clamp-1">{topMemes[0].title}</h3>
                        <div className="flex items-center gap-4">
                          {/* Vote count with user icon */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-white/90 font-['Poppins'] font-medium">{topMemes[0].voteCount}</span>
                          </div>
                          {/* NFT Minted */}
                          {topMemes[0].hasBeenMinted && (
                            <div className="flex items-center gap-2 bg-[#FFD700]/10 px-3 py-1 rounded-full">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className="text-[#FFD700] font-['Poppins'] text-sm">NFT</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Third Place */}
              {topMemes[2] && (
                <div className="relative w-[320px] h-[420px] mt-12 group">
                  {/* Position Badge */}
                  <div className="absolute -top-8 right-6 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#010EFB] rounded-full shadow-lg blur-sm opacity-50"></div>
                      <div className="relative w-16 h-16 bg-[#010EFB] rounded-full shadow-lg flex items-center justify-center">
                        <span className="text-[#FFD700] text-5xl font-bold font-['Poppins'] drop-shadow-lg">3</span>
                      </div>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="relative h-full rounded-[24px] overflow-hidden group-hover:scale-[1.02] transition-all duration-300 shadow-xl bg-[#1A1A1A]">
                    {/* Image Container with Gradient Overlay */}
                    <div className="relative h-full">
                      <img 
                        src={getIPFSGatewayURL(topMemes[2].ipfsHash)}
                        alt={topMemes[2].title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0">
                      <div className="p-6 bg-[#121212]/95 backdrop-blur-md border-b-2 border-[#FFD700] rounded-b-[24px]">
                        <h3 className="text-white text-lg font-semibold font-['Poppins'] mb-3 line-clamp-1">{topMemes[2].title}</h3>
                        <div className="flex items-center gap-4">
                          {/* Vote count with user icon */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-white/90 font-['Poppins'] font-medium">{topMemes[2].voteCount}</span>
                          </div>
                          {/* NFT Minted */}
                          {topMemes[2].hasBeenMinted && (
                            <div className="flex items-center gap-2 bg-[#FFD700]/10 px-3 py-1 rounded-full">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className="text-[#FFD700] font-['Poppins'] text-sm">NFT</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Top Ranked Memes Section */}
        <div className="mb-32">
          <h2 className="text-5xl font-bold mb-6 font-['Poppins'] text-center text-white">Top Ranked Memes</h2>
          <p className="text-white/70 text-lg mb-12 text-center font-['Poppins']">
            Vote to get rewarded. <a href="#" className='text-[#FFD700] hover:text-[#FFD700]/80 transition-colors'>Read more</a> on how it works.
          </p>
          
          {/* Filters and Search Bar */}
          <div className="flex items-center justify-between py-3 px-4 rounded-lg mb-4">
            {/* Left side - Filter */}
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm font-['Poppins']">Filter</span>
              <button 
                onClick={() => setActiveFilter('top rated')}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors font-['Poppins'] ${
                  activeFilter === 'top rated' 
                    ? 'bg-transparent text-[#FFD700] border-[#FFD700]' 
                    : 'text-white/60 border-transparent hover:text-white hover:border-white/60'
                }`}
              >
                top rated
              </button>
              <button 
                onClick={() => setActiveFilter('new')}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors font-['Poppins'] ${
                  activeFilter === 'new' 
                    ? 'bg-transparent text-[#FFD700] border-[#FFD700]' 
                    : 'text-white/60 border-transparent hover:text-white hover:border-white/60'
                }`}
              >
                new
              </button>
            </div>

            {/* Middle - Search Bar */}
            <div className="relative w-[300px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white pl-10 pr-4 py-1.5 rounded-full text-sm focus:outline-none border border-[#FFD700]/50 focus:border-[#FFD700] font-['Poppins']"
              />
            </div>

            {/* Right side - Status Filters */}
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm font-['Poppins']">Voting status</span>
              <button 
                onClick={() => setActiveStatus('voting open')}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors font-['Poppins'] ${
                  activeStatus === 'voting open' 
                    ? 'bg-transparent text-[#FFD700] border-[#FFD700]' 
                    : 'text-white/60 border-transparent hover:text-white hover:border-white/60'
                }`}
              >
                voting open
              </button>
              <button 
                onClick={() => setActiveStatus('NFT minted')}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors font-['Poppins'] ${
                  activeStatus === 'NFT minted' 
                    ? 'bg-transparent text-[#FFD700] border-[#FFD700]' 
                    : 'text-white/60 border-transparent hover:text-white hover:border-white/60'
                }`}
              >
                NFT minted
              </button>
              <button 
                onClick={() => setActiveStatus('voting closed')}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors font-['Poppins'] ${
                  activeStatus === 'voting closed' 
                    ? 'bg-transparent text-[#FFD700] border-[#FFD700]' 
                    : 'text-white/60 border-transparent hover:text-white hover:border-white/60'
                }`}
              >
                voting closed
              </button>
            </div>
          </div>

          {/* Meme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="relative w-[400px] mx-auto">
                {/* Vote Buttons */}
                <div className="absolute top-2 left-2 z-20">
                  <div className="flex items-center gap-1 bg-black/70 rounded-md backdrop-blur-sm">
                    <button 
                      className={`p-1.5 hover:opacity-80 transition-all ${
                        index === 0 ? 'text-yellow-400' : 'text-white'
                      }`}
                      aria-label="Upvote meme"
                    >
                      <svg 
                        className="w-3.5 h-3.5" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M12 3L20 15H4L12 3Z" 
                          fill="currentColor"
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <span className={`text-xs font-medium px-1 ${
                      index === 0 ? 'text-yellow-400' : 'text-white'
                    }`}>
                      {index + 1}
                    </span>
                    <button 
                      className={`p-1.5 hover:opacity-80 transition-all ${
                        index === 8 ? 'text-red-400' : 'text-white'
                      }`}
                      aria-label="Downvote meme"
                    >
                      <svg 
                        className="w-3.5 h-3.5" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M12 21L4 9H20L12 21Z" 
                          fill="currentColor"
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* NFT Minted Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1.5 bg-black/90 px-2.5 py-1.5 rounded-md">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm text-white">NFT minted</span>
                  </div>
                </div>

                {/* Card Container */}
                <div className="relative">
                  {/* Image Container */}
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                    <div 
                      className="w-full h-full"
                      style={{
                        background: 'linear-gradient(135deg, #0000FF, #E8E6FA, #F0B8FF)',
                      }}
                    />
                  </div>

                  {/* Title and Stats */}
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="px-4 py-3 bg-black/90 rounded-b-2xl">
                      <h3 className="text-white text-sm font-medium">This is a nice title</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">103</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">1063</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">NFT minted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Navigation */}
          <div className="flex justify-center items-center gap-2 mt-12 mb-16">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 flex items-center gap-1 transition-colors ${
                currentPage === 1 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-label="Previous page"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm">Previous</span>
            </button>

            <div className="flex items-center">
              {renderPageNumbers()}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 flex items-center gap-1 transition-colors ${
                currentPage === totalPages 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-label="Next page"
            >
              <span className="text-sm">Next</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mt-24 mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">Leaderboard</h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 hover:text-white transition-colors group ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Previous page"
              >
                <svg 
                  className="w-4 h-4 transform transition-transform group-hover:-translate-x-1" 
                  viewBox="0 0 24 24" 
                  fill="none"
                >
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 hover:text-white transition-colors group ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Next page"
              >
                Next
                <svg 
                  className="w-4 h-4 transform transition-transform group-hover:translate-x-1" 
                  viewBox="0 0 24 24" 
                  fill="none"
                >
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#0D0D0D] to-[#1A1A1A] rounded-xl p-6">
            <div className="grid grid-cols-6 gap-4 text-sm text-gray-400 mb-4 px-4">
              <div>meme</div>
              <div>votes</div>
              <div>title</div>
              <div>creator</div>
              <div>status</div>
              <div>voting transaction</div>
            </div>
            {[...Array(7)].map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 py-4 px-4 border-t border-gray-800/50 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20"></div>
                </div>
                <div className="text-white font-medium">165 / 600</div>
                <div className="text-white">Title goes here</div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20"></div>
                  <span className="text-white">Username</span>
                </div>
                <div className="text-white">voting open</div>
                <div className="text-white">OpenSea</div>
              </div>
            ))}

            {/* Leaderboard Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12 mb-16">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 flex items-center gap-1 transition-colors ${
                currentPage === 1 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-label="Previous page"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm">Previous</span>
            </button>

            <div className="flex items-center">
              {renderPageNumbers()}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 flex items-center gap-1 transition-colors ${
                currentPage === totalPages 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-label="Next page"
            >
              <span className="text-sm">Next</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
