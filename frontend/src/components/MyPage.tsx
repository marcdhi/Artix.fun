import { usePrivy } from '@privy-io/react-auth';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface MemeItem {
  title: string;
  username: string;
  progress: string;
  status: 'voting_open' | 'nft_minted' | 'voting_closed';
  votes: number;
  userCount: number;
}

function MyPage() {
  const { user } = usePrivy();
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(true);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);

  const memes: MemeItem[] = [
    { title: 'Title of the meme', username: "User's username", votes: 165, progress: '+9.6%', status: 'voting_open', userCount: 62 },
    { title: 'Title of the meme', username: "User's username", votes: 165, progress: '+9.6%', status: 'nft_minted', userCount: 62 },
    { title: 'Title of the meme', username: "User's username", votes: 165, progress: '+9.6%', status: 'voting_closed', userCount: 62 },
    { title: 'Title of the meme', username: "User's username", votes: 165, progress: '+9.6%', status: 'voting_open', userCount: 62 },
    { title: 'Title of the meme', username: "User's username", votes: 165, progress: '+9.6%', status: 'voting_open', userCount: 62 },
    { title: 'Title of the meme', username: "User's username", votes: 165, progress: '+9.6%', status: 'voting_open', userCount: 62 },
    { title: 'Title of the meme', username: "User's username", votes: 165, progress: '+9.6%', status: 'voting_open', userCount: 62 },
    { title: 'Title of the meme', username: "User's username", votes: 165, progress: '+9.6%', status: 'voting_open', userCount: 62 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Row 1: Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>

          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 border border-blue-600 text-blue-600 font-medium">
              + Vote
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white font-medium">
              + Create
            </button>
          </div>
        </div>

        {/* Row 2: Profile and Stats */}
        <div className="flex gap-8">
          {/* Profile Image */}
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 bg-blue-100 overflow-hidden flex-shrink-0 rounded-full">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-row gap-8 mb-6">
            {/* Profile Card */}
            <div className="bg-white p-8 border border-gray-200 flex-[2]">
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-sm text-gray-600 font-medium mb-2">AI Marketing Agent</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-semibold text-black">10 Posts</span>
                      <span className="px-4 py-1 text-sm bg-green-400 text-gray-900 rounded-full font-medium">Active</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setTwitterConnected(!twitterConnected)}
                        className={`w-14 h-7 rounded-full relative transition-colors duration-200 ${twitterConnected ? 'bg-blue-500' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute w-6 h-6 bg-white rounded-full top-0.5 shadow-sm transition-transform duration-200 ${twitterConnected ? 'translate-x-7' : 'translate-x-0.5'}`} />
                      </button>
                      <svg className="w-6 h-6 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Twitter</span>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setInstagramConnected(!instagramConnected)}
                        className={`w-14 h-7 rounded-full relative transition-colors duration-200 ${instagramConnected ? 'bg-blue-500' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute w-6 h-6 bg-white rounded-full top-0.5 shadow-sm transition-transform duration-200 ${instagramConnected ? 'translate-x-7' : 'translate-x-0.5'}`} />
                      </button>
                      <svg className="w-6 h-6 text-[#E4405F]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Instagram</span>
                  </div>

                  <Link to="/more" className="block text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 mt-6">
                    More {'->'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-col gap-6 flex-1">
              <div className="bg-white p-8 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                <div className="text-gray-600 mb-3">Votes received</div>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-medium text-black">605</div>
                  <div className="text-green-600 text-lg">+11%</div>
                </div>
              </div>

              <div className="bg-white p-8 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                <div className="text-gray-600 mb-3">Your profile rank</div>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-medium text-black">32,360</div>
                  <div className="text-green-600 text-lg">+11%</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 3: Wallet and Points */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 border border-gray-200">
            <div className="text-gray-600 mb-2">Artifact Wallet Balance</div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-medium">ET 2.03</div>
              <div className="text-green-600">+11%</div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200">
            <div className="text-gray-600 mb-2">Artifact Points</div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-medium">365</div>
              <div className="text-blue-600">Vote to earn points</div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200">
            <div className="text-gray-600 mb-2">You voted</div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-medium">8,236K</div>
              <div className="px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded">-1.2% last month</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            <button className="px-1 py-4 text-sm font-medium text-gray-900 border-b-2 border-gray-900">Your Voting History</button>
            <button className="px-1 py-4 text-sm font-medium text-gray-600">Your featured memes</button>
            <button className="px-1 py-4 text-sm font-medium text-gray-600">Created by you</button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-gray-900">Votes</button>
            <button className="text-sm font-medium text-gray-600">Highest</button>
            <button className="text-sm font-medium text-gray-600">Lowest</button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name"
              className="pl-8 pr-4 py-2 bg-white text-sm text-gray-900 border border-gray-200 focus:outline-none focus:border-blue-600"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Voting status</span>
            <button className="text-sm font-medium text-gray-600">Voting open</button>
            <button className="text-sm font-medium text-gray-600">NFT Minted</button>
            <button className="text-sm font-medium text-gray-600">Voting closed</button>
          </div>
        </div>

        {/* Memes Grid */}
        <div className="grid grid-cols-4 gap-6">
          {memes.map((meme, index) => (
            <div key={index} className="bg-white">
              <div className="aspect-square bg-[#F3F4F6] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-[17px] font-medium text-gray-900">{meme.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{meme.username}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <span className="text-gray-900">{meme.votes}</span>
                      <button className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                      <span className="text-sm text-gray-600">{meme.userCount}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-green-600">{meme.progress}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    <span className="text-gray-600">
                      {meme.status === 'voting_open' && 'Voting open'}
                      {meme.status === 'nft_minted' && 'NFT minted'}
                      {meme.status === 'voting_closed' && 'Voting closed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button className="p-1 text-gray-400">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="text-sm text-gray-600">Page</span>
          <button className="p-1 text-gray-400">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyPage; 