import LoginButton from './LoginButton';

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0A0A0A] via-[#111] to-[#0A0A0A] text-white font-['Inter']">
      {/* Navbar */}
      <header className="sticky top-0 border-b border-white/5 bg-black/20 backdrop-blur-lg z-50">
        <div className="flex justify-center w-full">
          <nav className="w-full max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-7 h-7" />
                <span className="text-lg font-medium tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Artix.fun
                </span>
              </div>
              
              {/* Center Navigation */}
              <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
                <a href="#leaderboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4">
                  Leaderboard
                </a>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                  Create
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300">
                  Connect wallet
                </button>
                <LoginButton />
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-4 flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-24">
          <div className="max-w-4xl w-full mx-auto text-center space-y-10">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-[120px] opacity-50" />
            </div>

            <h1 className="text-5xl sm:text-6xl mb-4 lg:text-7xl font-bold tracking-tight leading-[1.2]">
              Artix.fun – Meme Contest{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                DAO Platform
              </span>
            </h1>
            <h2 className="text-2xl sm:text-3xl font-medium text-white/90 tracking-tight m-8">
              Own, Vote & Earn from Memes on the Blockchain!
            </h2>
            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              A decentralized platform where memes gain value and their creators get rewarded.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 group">
              Create and Mint Memes
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </section>

        {/* Frontrunners Section */}
        <section className="flex flex-col items-center py-24 bg-gradient-to-b from-black/20 to-black/40 backdrop-blur-sm">
          <div className="max-w-[1200px] w-full mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-20">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Frontrunners
              </h2>
              <p className="text-lg sm:text-xl text-white/60 leading-relaxed">
                Top performing memes of the week
              </p>
            </div>

            {/* Frontrunners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[2, 1, 3].map((position, index) => (
                <div 
                  key={position}
                  className={`flex flex-col ${index === 1 ? '-mt-8' : 'mt-8'}`}
                >
                  <div className="group relative bg-white/[0.03] rounded-2xl overflow-hidden border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                    {/* Position Badge */}
                    <div className="absolute top-4 left-4 w-8 h-8 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center text-sm font-medium z-10 border border-white/10">
                      {position}
                    </div>

                    {/* Image Container */}
                    <div className="aspect-square bg-gradient-to-br from-white/[0.02] to-transparent relative group-hover:scale-[1.02] transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col p-7 space-y-5">
                      <div>
                        <h3 className="text-lg font-medium mb-2 group-hover:text-white transition-colors">
                          The Celeons
                        </h3>
                        <p className="text-sm text-white/60 group-hover:text-white/70 transition-colors">
                          The galaxy rules
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-3">
                        <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                          <div className="h-full w-[40%] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:from-blue-400 group-hover:to-indigo-400 transition-colors duration-500" />
                        </div>
                        <div className="flex justify-between text-sm text-white/40 font-medium">
                          <span className="group-hover:text-white/60 transition-colors">+9.6% progress</span>
                          <span className="group-hover:text-white/60 transition-colors">40%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;

