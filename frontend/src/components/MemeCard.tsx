interface MemeCardProps {
  title: string;
  username: string;
  progress: string;
  status: 'voting_open' | 'nft_minted' | 'voting_closed';
  votes: number;
  userCount: number;
}

function MemeCard({ title, username, progress, status, votes, userCount }: MemeCardProps) {
  return (
    <div className="bg-white">
      {/* Image Section */}
      <div className="aspect-square bg-[#F3F4F6] relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-400" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z" />
          </svg>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-[17px] font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{username}</p>

        {/* Voting Section */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Vote Controls */}
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <span className="text-gray-900">{votes}</span>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* User Count */}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span className="text-sm text-gray-600">{userCount}</span>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-green-600">{progress}</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span className="text-gray-600">
              {status === 'voting_open' && 'Voting open'}
              {status === 'nft_minted' && 'NFT minted'}
              {status === 'voting_closed' && 'Voting closed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemeCard; 