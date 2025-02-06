import Frontrunners from './Frontrunners';
import TopRankedMemes from './TopRankedMemes';
import Leaderboard from './Leaderboard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] text-gray-900 font-['Inter']">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Artix.fun – Meme Contest DAO Platform
            </motion.h1>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
            >
              Own, Vote & Earn from Memes on the Blockchain!
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-600 mb-12 max-w-2xl"
            >
              A decentralized platform where memes gain value and their creators get rewarded.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/create"
                className="px-6 py-3 bg-blue-600 text-white font-medium text-base hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                Create and Mint Memes
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link
                to="/explore"
                className="px-6 py-3 bg-gray-900 text-white font-medium text-base hover:bg-gray-800 transition-colors duration-200"
              >
                Explore Memes
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="py-20 bg-white border-t border-gray-200"
      >
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-2">10K+</h3>
              <p className="text-gray-600">Memes Created</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-2">50K+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-2">100K+</h3>
              <p className="text-gray-600">Total Votes</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Sections */}
      <div className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto space-y-20">
          <Frontrunners />
          <TopRankedMemes />
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}

export default Home;
