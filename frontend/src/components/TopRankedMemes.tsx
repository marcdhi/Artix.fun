import MemeCard from './MemeCard';

function TopRankedMemes() {
  const memes = [
    { id: 1, title: 'Title of the meme', username: "User's username", votes: 0, progress: '+9.6% progress', status: 'voting_open' as const, userCount: 62 },
    { id: 2, title: 'Title of the meme', username: "User's username", votes: 0, progress: '+9.6% progress', status: 'nft_minted' as const, userCount: 62 },
    { id: 3, title: 'Title of the meme', username: "User's username", votes: 0, progress: '+9.6% progress', status: 'voting_closed' as const, userCount: 62 },
    { id: 4, title: 'Title of the meme', username: "User's username", votes: 0, progress: '+9.6% progress', status: 'voting_open' as const, userCount: 62 },
  ];

  return (
    <section className="w-full py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-[32px] font-bold mb-2 text-gray-900">
          Top Ranked Memes
        </h2>
        <p className="text-base text-gray-600">
          Vote the memes and get rewarded
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Filters */}
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Filter</span>
            <div className="flex gap-4">
              <button className="text-gray-900 font-medium">Top rated</button>
              <button className="text-gray-600">New</button>
              <button className="text-gray-600">NFT</button>
            </div>
          </div>

          {/* Search Dropdown */}
          <div className="relative min-w-[240px] bg-[#F3F4F6]">
            <div className="flex items-center px-4 py-2">
              <svg className="w-5 h-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600">Placeholder</span>
              <svg className="w-5 h-5 text-gray-400 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Right Filters */}
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Voting status</span>
            <div className="flex gap-4">
              <button className="text-gray-600">Voting open</button>
              <button className="text-gray-600">NFT Minted</button>
              <button className="text-gray-600">Voting closed</button>
            </div>
          </div>
        </div>
      </div>

      {/* Memes Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {memes.map((meme) => (
            <MemeCard key={meme.id} {...meme} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopRankedMemes; 