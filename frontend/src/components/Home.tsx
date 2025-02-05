import LoginButton from './LoginButton';
import Frontrunners from './Frontrunners';
import TopRankedMemes from './TopRankedMemes';
import Leaderboard from './Leaderboard';
import { motion } from 'framer-motion';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#1a1a1a] to-[#0A0A0A] text-white font-['Inter']">
      {/* Navbar */}
      <header className="sticky top-0 border-b border-white/5 bg-black/20 backdrop-blur-xl z-50">
        <div className="flex justify-center w-full">
          <div className="w-full max-w-[1400px] px-6 lg:px-12">
            <div className="flex items-center justify-between h-24">
              {/* Logo */}
              <motion.div 
                className="flex items-center gap-4 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src="/logo.png" alt="Logo" className="w-10 h-10" />
                <span className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                  Artix.fun
                </span>
              </motion.div>
              
              {/* Center Navigation Links */}
              <nav className="hidden md:flex items-center gap-12">
                <motion.a 
                  href="#explore"
                  whileHover={{ scale: 1.05 }}
                  className="text-base font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Explore
                </motion.a>
                <motion.a 
                  href="#trending"
                  whileHover={{ scale: 1.05 }}
                  className="text-base font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Trending
                </motion.a>
                <motion.a 
                  href="#about"
                  whileHover={{ scale: 1.05 }}
                  className="text-base font-medium text-gray-300 hover:text-white transition-colors"
                >
                  About
                </motion.a>
              </nav>
              
              {/* Right Side */}
              <div className="flex items-center gap-6">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  Create
                </motion.button>
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center w-full">
        <div className="w-full max-w-[1400px] px-6 lg:px-12">
          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] py-24"
          >
            <div className="w-full max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text leading-tight">
                  Artix.fun – Meme Contest DAO Platform
                </h1>
                <p className="text-2xl sm:text-3xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                  Own, Vote & Earn from Memes on the Blockchain!
                </p>
              </motion.div>
              <motion.div 
                className="mt-16 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-2xl">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-10 py-4 text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    Get Started
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-10 py-4 text-lg font-medium border-2 border-white/20 hover:border-white/40 rounded-full transition-all duration-300"
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Content Sections */}
          <div className="flex flex-col items-center pb-32">
            {/* Frontrunners Section */}
            <section className="w-full mb-40">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full bg-gradient-to-b from-white/[0.03] to-transparent p-16 sm:p-20 rounded-[2.5rem] border border-white/5 shadow-2xl"
              >
                <Frontrunners />
              </motion.div>
            </section>

            {/* Top Ranked Memes Section */}
            <section className="w-full mb-40">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full bg-gradient-to-b from-white/[0.03] to-transparent p-16 sm:p-20 rounded-[2.5rem] border border-white/5 shadow-2xl"
              >
                <TopRankedMemes />
              </motion.div>
            </section>

            {/* Leaderboard Section */}
            <section className="w-full mb-40">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="w-full bg-gradient-to-b from-white/[0.03] to-transparent p-16 sm:p-20 rounded-[2.5rem] border border-white/5 shadow-2xl"
              >
                <Leaderboard />
              </motion.div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer Gradient */}
      <div className="h-48 bg-gradient-to-t from-purple-500/10 to-transparent" />
    </div>
  );
}

export default Home;

