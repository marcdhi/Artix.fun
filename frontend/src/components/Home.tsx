import { Link } from 'react-router-dom';
import { useState } from 'react';

type VoteType = 'up' | 'down' | null;

interface MemeVote {
  count: number;
  userVote: VoteType;
}

const Home = () => {
  // Add states for active tabs
  const [activeFilter, setActiveFilter] = useState<'top rated' | 'new'>('top rated');
  const [activeStatus, setActiveStatus] = useState<'voting open' | 'NFT minted' | 'voting closed'>('voting open');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 68;
  const [votes, setVotes] = useState<{ [key: number]: MemeVote }>(
    [...Array(9)].reduce((acc, _, index) => ({
      ...acc,
      [index]: { count: Math.floor(Math.random() * 1000), userVote: null }
    }), {})
  );

  const handleVote = (index: number, voteType: 'up' | 'down') => {
    setVotes(prev => {
      const currentVote = prev[index];
      let newCount = currentVote.count;
      let newUserVote: VoteType = voteType;

      // If clicking the same vote type, remove the vote
      if (currentVote.userVote === voteType) {
        newCount = voteType === 'up' ? newCount - 1 : newCount + 1;
        newUserVote = null;
      } 
      // If changing vote from opposite type
      else if (currentVote.userVote !== null) {
        newCount = voteType === 'up' ? newCount + 2 : newCount - 2;
      }
      // If voting for the first time
      else {
        newCount = voteType === 'up' ? newCount + 1 : newCount - 1;
      }

      return {
        ...prev,
        [index]: {
          count: newCount,
          userVote: newUserVote
        }
      };
    });
  };

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
    <div className="relative min-h-screen bg-black text-white rounded-t-[120px] bg-gradient-to-b from-[#020B44] via-black to-black mt-20">
      <div className="max-w-7xl mx-auto px-4 ">
        {/* Hero Section */}
        <div className="pt-8 pb-8">
          <h3 className="text-yellow-400 text-xl font-medium mb-2">
            Artix.fun
          </h3>
          <h1 className="text-[80px] font-bold mb-2 font-['Inter'] text-[#f0f1f3]">
            Meme Contest DAO Platform
          </h1>
          <p className="text-gray-400 text-lg mb-4">
            Own, Vote & Earn from Memes on the <br/ > Blockchain!
          </p>
          <Link
            to="/create"
            className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-medium"
          >
            + create
          </Link>
        </div>

        {/* Best of Memes Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 font-['Inter']">Best of Memes</h2>
          <div className="flex justify-center items-center gap-6 relative px-4">
            {/* Second Place */}
            <div className="relative w-[300px] h-[400px] mt-8">
              <div className="absolute -top-4 right-4 z-10 w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
                <span className="relative text-yellow-400 text-5xl font-bold">2</span>
              </div>
              <div className="relative h-full rounded-[20px] overflow-hidden group-hover:scale-[1.02] transition-transform">
                <div 
                  className="h-full w-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(183, 233, 247, 0.2), rgba(219, 243, 250, 0.2), rgba(243, 231, 254, 0.2))',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="px-4 py-3 bg-black/80 border-b-2 border-yellow-400 rounded-b-[20px]">
                    <h3 className="text-white text-sm font-medium">This is a nice title</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">👁 103</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">❤️ 1063</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">✨ NFT minted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* First Place */}
            <div className="relative w-[300px] h-[400px] -mt-8">
              <div className="absolute -top-4 right-4 z-10 w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
                <span className="relative text-yellow-400 text-5xl font-bold">1</span>
              </div>
              <div className="relative h-full rounded-[20px] overflow-hidden group-hover:scale-[1.02] transition-transform">
                <div 
                  className="h-full w-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(183, 233, 247, 0.2), rgba(219, 243, 250, 0.2), rgba(243, 231, 254, 0.2))',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="px-4 py-3 bg-black/80 border-b-2 border-yellow-400 rounded-b-[20px]">
                    <h3 className="text-white text-sm font-medium">This is a nice title</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">👁 103</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">❤️ 1063</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">✨ NFT minted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Place */}
            <div className="relative w-[300px] h-[400px] mt-8">
              <div className="absolute -top-4 right-4 z-10 w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
                <span className="relative text-yellow-400 text-5xl font-bold">3</span>
              </div>
              <div className="relative h-full rounded-[20px] overflow-hidden group-hover:scale-[1.02] transition-transform">
                <div 
                  className="h-full w-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(183, 233, 247, 0.2), rgba(219, 243, 250, 0.2), rgba(243, 231, 254, 0.2))',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="px-4 py-3 bg-black/80 border-b-2 border-yellow-400 rounded-b-[20px]">
                    <h3 className="text-white text-sm font-medium">This is a nice title</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">👁 103</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">❤️ 1063</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">✨ NFT minted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Ranked Memes Section */}
        <div>
          <h2 className="text-4xl font-bold mb-4 font-['Inter'] flex justify-center">Top Ranked Memes</h2>
          <p className="text-gray-400 text-sm mb-8 flex justify-center">Vote to get rewarded.  <a href="#" className='text-yellow-400 mr-1 ml-1'>Read more </a> on how it works.</p>
          
          {/* Filters and Search Bar */}
          <div className="flex items-center justify-between py-3 px-4 rounded-lg mb-4">
            {/* Left side - Filter */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Filter</span>
              <button 
                onClick={() => setActiveFilter('top rated')}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  activeFilter === 'top rated' 
                    ? 'bg-transparent text-yellow-400 border-yellow-400' 
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-400'
                }`}
              >
                top rated
              </button>
              <button 
                onClick={() => setActiveFilter('new')}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  activeFilter === 'new' 
                    ? 'bg-transparent text-yellow-400 border-yellow-400' 
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-400'
                }`}
              >
                new
              </button>
            </div>

            {/* Middle - Search Bar */}
            <div className="relative w-[300px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white pl-10 pr-4 py-1.5 rounded-full text-sm focus:outline-none border border-yellow-400/50 focus:border-yellow-400"
              />
            </div>

            {/* Right side - Status Filters */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Voting status</span>
              <button 
                onClick={() => setActiveStatus('voting open')}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  activeStatus === 'voting open' 
                    ? 'bg-transparent text-yellow-400 border-yellow-400' 
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-400'
                }`}
              >
                voting open
              </button>
              <button 
                onClick={() => setActiveStatus('NFT minted')}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  activeStatus === 'NFT minted' 
                    ? 'bg-transparent text-yellow-400 border-yellow-400' 
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-400'
                }`}
              >
                NFT minted
              </button>
              <button 
                onClick={() => setActiveStatus('voting closed')}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  activeStatus === 'voting closed' 
                    ? 'bg-transparent text-yellow-400 border-yellow-400' 
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-400'
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
                      onClick={() => handleVote(index, 'up')}
                      className={`p-1.5 hover:opacity-80 transition-all ${
                        votes[index].userVote === 'up' ? 'text-yellow-400' : 'text-white'
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
                      votes[index].userVote === 'up' 
                        ? 'text-yellow-400' 
                        : votes[index].userVote === 'down'
                          ? 'text-red-400'
                          : 'text-white'
                    }`}>
                      {votes[index].count}
                    </span>
                    <button 
                      onClick={() => handleVote(index, 'down')}
                      className={`p-1.5 hover:opacity-80 transition-all ${
                        votes[index].userVote === 'down' ? 'text-red-400' : 'text-white'
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
