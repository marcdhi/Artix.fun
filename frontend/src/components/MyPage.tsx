import { useState } from 'react';

const MyPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;
  const [isTwitterEnabled, setIsTwitterEnabled] = useState(true);
  const [isInstagramEnabled, setIsInstagramEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('voting');
  const [voteFilter, setVoteFilter] = useState<'highest' | 'lowest'>('highest');
  const [votingStatus, setVotingStatus] = useState<'voting' | 'minted' | 'closed'>('voting');

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  type TabType = 'voting' | 'featured' | 'created';

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const getTabStyles = (tab: TabType) => {
    const baseStyles = "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200";
    const activeStyles = "bg-black border border-yellow-400 rounded-full text-yellow-400";
    const inactiveStyles = "text-gray-400 hover:text-white";
    
    return `${baseStyles} ${activeTab === tab ? activeStyles : inactiveStyles}`;
  };

  const getFilterButtonStyles = (currentValue: string, activeValue: string) => {
    const baseStyles = "px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200";
    const activeStyles = "bg-black text-yellow-400 border border-yellow-400";
    const inactiveStyles = "text-gray-400 hover:text-white";
    
    return `${baseStyles} ${currentValue === activeValue ? activeStyles : inactiveStyles}`;
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      if (currentPage <= 3) {
        // If current page is near the start
        pageNumbers.push(2, 3, 4);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // If current page is near the end
        pageNumbers.push('...');
        pageNumbers.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // If current page is in the middle
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const getPageButtonStyles = (page: number | string) => {
    const baseStyles = "w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200";
    
    if (page === '...') {
      return "text-gray-400";
    }
    
    if (page === currentPage) {
      return `${baseStyles} bg-yellow-400 text-black`;
    }
    
    return `${baseStyles} text-gray-400 hover:text-white hover:bg-[#1A1A1A]`;
  };

  return (
    <div className="min-h-screen pt-24 px-4 rounded-t-[120px] bg-gradient-to-b from-[#020B44] via-black to-black">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">User's username</span>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 via-blue-300 to-purple-200"></div>
          </div>
        </div>

       
        {/* Current Rank Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Current rank: Novice</h2>
          <p className="text-gray-400 mb-4">Rank progress</p>
          {/* Rank Progress Bar */}
          <div className="relative h-2 bg-gray-800 rounded-full mb-2">
            <div className="absolute left-0 top-0 h-full w-1/5 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
          </div>
          {/* Rank Labels */}
          <div className="flex justify-between text-sm">
            <span className="text-white">Novice</span>
            <span className="text-gray-400">Enthusiast</span>
            <span className="text-gray-400">Master</span>
            <span className="text-gray-400">Legend</span>
            <span className="text-gray-400">God</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {/* Rank Benefits Card */}
          <div className="bg-gradient-to-br from-[#111111] via-[#2A2A2A] to-transparent rounded-[20px] p-6">
            <h3 className="text-lg text-white mb-4">Rank benefits</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>Free upvote of voted memes</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>Platform reward points</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>Whitelist eligibility meme tokens</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>Exclusive ranking NFT eligibility</span>
              </li>
            </ul>
          </div>

          {/* Total Votes Card */}
          <div className="bg-gradient-to-br from-[#111111] via-[#2A2A2A] to-transparent rounded-[20px] p-6">
            <h3 className="text-lg text-white mb-4">Total votes</h3>
            <p className="text-3xl font-bold text-white mb-4">605</p>
            <a href="#" className="text-yellow-400 text-sm hover:text-yellow-500 transition-colors">
              create now →
            </a>
          </div>

          {/* Total Points Card */}
          <div className="bg-gradient-to-br from-[#151414] via-[#2A2A2A] to-transparent rounded-[20px] p-6">
            <h3 className="text-lg text-white mb-4">Total Points</h3>
            <p className="text-3xl font-bold text-white">605</p>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-br from-transparent via-[#2A2A2A] to-[#6b6a6a] rounded-[20px] p-6 relative overflow-hidden">
            {/* Status Indicator */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">Active</span>
            </div>

            {/* Role and Posts */}
            <h3 className="text-lg text-white mb-1">AI Marketing Agent</h3>
            <p className="text-gray-400 mb-4">10 Posts</p>

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
                    isTwitterEnabled ? 'border-1 border-yellow-400 bg-black' : 'bg-black'
                  }`}></div>
                  <div className={`absolute w-3 h-3 bg-white rounded-full top-0.5 left-0.5 transition-transform duration-200 ${
                    isTwitterEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}></div>
                </label>
                <svg 
                  className={`w-4 h-4 transition-colors duration-200 ${
                    isTwitterEnabled ? 'text-yellow-400' : 'text-gray-300'
                  }`} 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  aria-hidden="true"
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
                    isInstagramEnabled ? 'border-1 border-yellow-400 bg-black' : 'bg-black'
                  }`}></div>
                  <div className={`absolute w-3 h-3 bg-white rounded-full top-0.5 left-0.5 transition-transform duration-200 ${
                    isInstagramEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}></div>
                </label>
                <svg 
                  className={`w-4 h-4 transition-colors duration-200 ${
                    isInstagramEnabled ? 'text-yellow-400' : 'text-gray-300'
                  }`} 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </div>
            </div>

            {/* More Link */}
            <a href="#" className="text-yellow-400 text-sm hover:text-yellow-500 transition-colors inline-flex items-center gap-1">
              More 
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>


         {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-2 bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-4">
          {/* Left side - Filter options */}
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Votes</span>
            <button 
              onClick={() => setVoteFilter('highest')}
              className={getFilterButtonStyles('highest', voteFilter)}
            >
              highest
            </button>
            <button 
              onClick={() => setVoteFilter('lowest')}
              className={getFilterButtonStyles('lowest', voteFilter)}
            >
              lowest
            </button>
          </div>

          {/* Middle - Search bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="search"
                className="w-full bg-[#1A1A1A] text-gray-400 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-500"
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
            <span className="text-gray-400 text-sm">Voting status</span>
            <button 
              onClick={() => setVotingStatus('voting')}
              className={getFilterButtonStyles('voting', votingStatus)}
            >
              voting open
            </button>
            <button 
              onClick={() => setVotingStatus('minted')}
              className={getFilterButtonStyles('minted', votingStatus)}
            >
              NFT minted
            </button>
            <button 
              onClick={() => setVotingStatus('closed')}
              className={getFilterButtonStyles('closed', votingStatus)}
            >
              voting closed
            </button>
          </div>
        </div>


        {/* Secondary Navigation Bar */}
        <div className="flex items-center gap-6 mb-2 px-2">
          <button 
            onClick={() => handleTabChange('voting')}
            className={getTabStyles('voting')}
          >
            {activeTab === 'voting' && <span className="w-2 h-2 rounded-full bg-yellow-400"></span>}
            Your voting history
          </button>
          <button 
            onClick={() => handleTabChange('featured')}
            className={getTabStyles('featured')}
          >
            {activeTab === 'featured' && <span className="w-2 h-2 rounded-full bg-yellow-400"></span>}
            your featured memes
          </button>
          <button 
            onClick={() => handleTabChange('created')}
            className={getTabStyles('created')}
          >
            {activeTab === 'created' && <span className="w-2 h-2 rounded-full bg-yellow-400"></span>}
            created by you
          </button>
        </div>


        {/* Meme History Section */}
        <div className="bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-2">
          <h2 className="text-2xl font-bold text-white mb-8">
            {activeTab === 'voting' && "Your Memes History"}
            {activeTab === 'featured' && "Your Featured Memes"}
            {activeTab === 'created' && "Memes Created by You"}
          </h2>
          
          {/* Meme Grid */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="group relative bg-black rounded-xl overflow-hidden">
                {/* Top Stats Bar */}
                <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-black/90 z-10">
                  <div className="flex items-center gap-4">
                    {/* Upvote */}
                    <button 
                      className="text-white hover:text-yellow-400 transition-colors"
                      aria-label="Upvote meme"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </button>
                    
                    {/* Vote Count */}
                    <span className="text-sm text-white">103</span>
                    
                    {/* Downvote */}
                    <button 
                      className="text-white hover:text-yellow-400 transition-colors"
                      aria-label="Downvote meme"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </button>
                  </div>

                  {/* NFT Status */}
                  <div className="flex items-center gap-1.5 bg-black/80 px-2 py-1 rounded-full">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7L12 12L22 7L12 2Z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 17L12 22L22 17"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12L12 17L22 12"/>
                    </svg>
                    <span className="text-xs text-white">NFT minted</span>
                  </div>
                </div>

                {/* Meme Image/Content */}
                <div className="aspect-square w-full">
                  <div className="w-full h-full bg-gradient-to-br from-[#FFD6E0] via-[#C3FCF2] to-[#EBF4FF] group-hover:scale-105 transition-transform duration-300"></div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white text-sm font-medium">This is a nice title</h3>
                    {/* Profile Icon */}
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* View Count */}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        103
                      </span>
                      {/* Like Count */}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        1063
                      </span>
                    </div>
                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-400">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 py-4">
            {/* Previous Button */}
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 flex items-center gap-2 rounded-full transition-all duration-200 ${
                currentPage === 1 
                  ? 'text-gray-600 cursor-not-allowed opacity-50' 
                  : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
              }`}
              aria-label="Previous page"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className={getPageButtonStyles(page)}>...</span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageChange(Number(page))}
                    className={getPageButtonStyles(Number(page))}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            {/* Next Button */}
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 flex items-center gap-2 rounded-full transition-all duration-200 ${
                currentPage === totalPages 
                  ? 'text-gray-600 cursor-not-allowed opacity-50' 
                  : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
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
  );
};

export default MyPage;