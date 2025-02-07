import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

const MyPage = () => {
  const { user } = usePrivy();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 rounded-t-4xl bg-gradient-to-b from-[#020B44] via-black to-black">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {/* Profile Card */}
          <div className="bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">Active</span>
            </div>
            <h3 className="text-lg text-gray-200 mb-1">AI Marketing Agent</h3>
            <p className="text-gray-400 mb-4">10 Posts</p>
            <div className="flex items-center gap-3 mb-4">
              <button className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-yellow-400 hover:bg-[#2A2A2A] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-yellow-400 hover:bg-[#2A2A2A] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </button>
            </div>
            <a href="#" className="text-yellow-400 text-sm hover:text-yellow-500 transition-colors">
              More →
            </a>
          </div>

          {/* Profile Rank Card */}
          <div className="bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">11% progress</span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Your profile rank</h3>
            <p className="text-2xl font-semibold text-white mb-2">32,360</p>
            <a href="#" className="text-yellow-400 text-sm hover:text-yellow-500 transition-colors">
              Go to leaderboard →
            </a>
          </div>

          {/* Votes Received Card */}
          <div className="bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">11% progress</span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Votes received</h3>
            <p className="text-2xl font-semibold text-white mb-2">605</p>
            <a href="#" className="text-yellow-400 text-sm hover:text-yellow-500 transition-colors">
              create now →
            </a>
          </div>

          {/* Wallet Balance Card */}
          <div className="bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">11% progress</span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Wallet Balance</h3>
            <p className="text-2xl font-semibold text-white mb-2">605</p>
            <a href="#" className="text-yellow-400 text-sm hover:text-yellow-500 transition-colors">
              Explore memes →
            </a>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {/* Wallet Balance Card */}
          <div className="bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">11% progress</span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Wallet Balance</h3>
            <p className="text-2xl font-semibold text-white mb-2">605</p>
            <a href="#" className="text-yellow-400 text-sm hover:text-yellow-500 transition-colors">
              Explore memes →
            </a>
          </div>

          {/* Artix Points Card */}
          <div className="bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">11% progress</span>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Artix Points</h3>
            <p className="text-2xl font-semibold text-white mb-2">605</p>
            <a href="#" className="text-yellow-400 text-sm hover:text-yellow-500 transition-colors">
              Points benefits
            </a>
          </div>
        </div>

        {/* Meme History Section */}
        <div className="bg-[#0A0A0A]/40 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-8">Your Memes History</h2>
          
          {/* Meme Grid */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="group relative">
                <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 group-hover:scale-105 transition-transform duration-300"></div>
                  
                  {/* NFT Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1.5 bg-black/90 px-2.5 py-1.5 rounded-md">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm text-white">NFT minted</span>
                    </div>
                  </div>

                  {/* Vote Count */}
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded-md">
                      <span className="text-sm text-white">165 / 600</span>
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="px-4 py-3 bg-black/90 rounded-b-xl">
                    <h3 className="text-white text-sm font-medium mb-2">Title goes here</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">👁 103</span>
                        <span className="text-xs text-gray-400">❤️ 1063</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-400">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
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

            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium bg-yellow-400 text-black">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:text-white">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:text-white">3</button>
              <span className="text-gray-400">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:text-white">8</button>
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
  );
};

export default MyPage;