import { motion } from 'framer-motion';

function TopRankedMemes() {
  const memes = [
    { id: 1, title: 'Epic Meme 1', votes: 2453, creator: '0x1234...5678' },
    { id: 2, title: 'Viral Meme 2', votes: 2198, creator: '0x8765...4321' },
    { id: 3, title: 'Trending Meme 3', votes: 1876, creator: '0x9876...1234' },
    { id: 4, title: 'Popular Meme 4', votes: 1654, creator: '0x4567...8901' },
  ];

  return (
    <section className="w-full py-8 px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Top Ranked Memes
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">Most voted memes of all time</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 w-full">
        {memes.map((meme, index) => (
          <motion.div
            key={meme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-gradient-to-b from-white/10 to-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            {/* Image Placeholder */}
            <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Vote Count Badge */}
              <div className="absolute top-6 right-6 px-4 py-2 bg-black/50 backdrop-blur-xl rounded-full text-sm font-medium shadow-lg">
                {meme.votes.toLocaleString()} votes
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h3 className="text-lg font-semibold mb-4 truncate">{meme.title}</h3>
              <p className="text-sm text-gray-400 truncate mb-8">
                by {meme.creator}
              </p>
              
              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3.5 px-6 bg-white/5 hover:bg-white/10 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default TopRankedMemes; 