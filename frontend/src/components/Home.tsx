import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4">
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
          <h2 className="text-4xl font-bold mb-12">Top Ranked Memes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="group">
                <div 
                  className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-400/20 to-blue-400/20 backdrop-blur-sm"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Placeholder for meme image */}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-300">This is a meme title</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">1.2K votes</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">@creator</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mt-24 mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">Leaderboard</h2>
            <Link 
              to="/leaderboard"
              className="text-yellow-400 hover:text-yellow-500 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl p-6">
            <div className="grid grid-cols-6 gap-4 text-sm text-gray-400 mb-4">
              <div>Rank</div>
              <div className="col-span-2">Meme</div>
              <div>Votes</div>
              <div>Creator</div>
              <div>Voting Incentives</div>
            </div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 py-4 border-t border-gray-800">
                <div className="text-gray-500">#{index + 1}</div>
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-400/20 to-blue-400/20"></div>
                  <span className="text-gray-300">Meme Title</span>
                </div>
                <div className="text-gray-300">1.2K</div>
                <div className="text-gray-300">@creator</div>
                <div className="text-yellow-400">0.5 ETH</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
