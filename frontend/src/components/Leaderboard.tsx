import { motion } from 'framer-motion';

function Leaderboard() {
  const users = [
    { id: 1, address: '0x1234...5678', points: 12500, memes: 45, rank: 1 },
    { id: 2, address: '0x8765...4321', points: 10200, memes: 38, rank: 2 },
    { id: 3, address: '0x9876...1234', points: 8900, memes: 32, rank: 3 },
    { id: 4, address: '0x4567...8901', points: 7600, memes: 28, rank: 4 },
    { id: 5, address: '0x3456...7890', points: 6300, memes: 25, rank: 5 },
  ];

  return (
    <section className="w-full py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Top Contributors
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">Most active members in our community</p>
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-white/5">
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-300">Rank</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-300">Address</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-300">Points</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-300">Memes</th>
                <th className="px-8 py-6 text-right text-sm font-semibold text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="px-8 py-6">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-lg
                      ${user.rank === 1 ? 'bg-yellow-500/20 text-yellow-300' :
                        user.rank === 2 ? 'bg-gray-300/20 text-gray-300' :
                        user.rank === 3 ? 'bg-orange-500/20 text-orange-300' :
                        'bg-white/10 text-gray-400'}
                    `}>
                      {user.rank}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-medium">{user.address}</td>
                  <td className="px-8 py-6">
                    <span className="text-green-400 font-medium">{user.points.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6 text-gray-300">{user.memes}</td>
                  <td className="px-8 py-6 text-right">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 hover:shadow-lg"
                    >
                      View Profile
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Leaderboard; 