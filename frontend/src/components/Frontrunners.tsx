import { motion } from 'framer-motion';

function Frontrunners() {
  return (
    <section className="w-full py-8 px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Frontrunners
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">Top performing memes of the week</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
        {[2, 1, 3].map((position) => (
          <motion.div 
            key={position}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={`relative bg-gradient-to-b from-white/10 to-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 ${
              position === 1 ? '-mt-6 md:mt-0 md:-mb-6' : ''
            }`}
          >
            {/* Position Badge */}
            <div className={`absolute top-6 left-6 w-12 h-12 backdrop-blur-xl rounded-full flex items-center justify-center text-lg font-semibold z-10 shadow-lg ${
              position === 1 ? 'bg-yellow-500/30 text-yellow-300' :
              position === 2 ? 'bg-gray-300/30 text-gray-200' :
              'bg-orange-500/30 text-orange-300'
            }`}>
              {position}
            </div>

            {/* Image Placeholder with Gradient Overlay */}
            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-8">
              <h3 className="text-xl font-semibold mb-4">Title of the meme</h3>
              <p className="text-gray-300 mb-8">Description here</p>
              
              {/* Progress Bar */}
              <div className="mt-8">
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full ${
                      position === 1 ? 'bg-gradient-to-r from-yellow-500 to-yellow-300' :
                      position === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-300' :
                      'bg-gradient-to-r from-orange-500 to-orange-300'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: '40%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-green-400 font-medium">+9.6%</span>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-8 py-3.5 px-6 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
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

export default Frontrunners; 