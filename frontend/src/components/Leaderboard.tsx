import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
interface LeaderboardItem {
  votes: string;
  title: string;
  marketcap: string;
  marketcapChange: string;
  volume24h: string;
  netAssetValue: string;
}

function Leaderboard() {
  const leaderboardData: LeaderboardItem[] = [
    {
      votes: '165/600',
      title: 'Title',
      marketcap: '$26,362.32',
      marketcapChange: '-14.40%',
      volume24h: '$1,412,265.32',
      netAssetValue: '$1,412,265.32'
    },
    {
      votes: '165/600',
      title: 'Title',
      marketcap: '$26,362.32',
      marketcapChange: '-14.40%',
      volume24h: '$1,412,265.32',
      netAssetValue: '$1,412,265.32'
    },
    {
      votes: '165/600',
      title: 'Title',
      marketcap: '$26,362.32',
      marketcapChange: '-14.40%',
      volume24h: '$1,412,265.32',
      netAssetValue: '$1,412,265.32'
    },
    {
      votes: '165/600',
      title: 'Title',
      marketcap: '$26,362.32',
      marketcapChange: '-14.40%',
      volume24h: '$1,412,265.32',
      netAssetValue: '$1,412,265.32'
    },
    {
      votes: '165/600',
      title: 'Title',
      marketcap: '$26,362.32',
      marketcapChange: '-14.40%',
      volume24h: '$1,412,265.32',
      netAssetValue: '$1,412,265.32'
    }
  ];

  return (
    <section className="w-full py-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[32px] font-bold text-gray-900">Leaderboard</h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[#F3F4F6] text-gray-900 text-sm">1 H</button>
              <button className="px-3 py-1 text-gray-600 text-sm">24 H</button>
            </div>
            <div className="flex gap-2">
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



        {/* Table */}
        <div className="w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 text-left text-sm font-medium text-gray-600">Votes</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">Meme</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">Marketcap</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">Marketcap %</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">24H Volume</th>
                <th className="py-4 text-left text-sm font-medium text-gray-600">Net Asset Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaderboardData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                  <td className="py-4 text-sm text-gray-900">{item.votes}</td>
                  <td className="py-4 text-sm text-gray-900">{item.title}</td>
                  <td className="py-4 text-sm text-gray-900">{item.marketcap}</td>
                  <td className="py-4 text-sm text-red-500">{item.marketcapChange}</td>
                  <td className="py-4 text-sm text-gray-900">{item.volume24h}</td>
                  <td className="py-4 text-sm text-gray-900">{item.netAssetValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Memes Button */}
        <div className="mt-8 flex justify-center">
          <Link to="/create" className="px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
            Create Memes
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Leaderboard; 