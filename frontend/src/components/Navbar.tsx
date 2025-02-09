"use client";
import { usePrivy } from '@privy-io/react-auth';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// const Logo = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M8.5 10L12 13.5L15.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

const Navbar = () => {
  const { login, authenticated, user, logout } = usePrivy();
  const [scrolled, setScrolled] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [balance, setBalance] = useState<string>('0.00');

  console.log('balance', balance);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (user) {
      if (user.google) {
        setUserDisplayName(user.google.email.split('@')[0]);
      } else if (user.email) {
        setUserDisplayName(user.email.address.split('@')[0]);
      } else if (user.wallet) {
        setUserDisplayName(user.wallet.address.slice(0, 6));
      } else {
        setUserDisplayName(user.id.slice(0, 6));
      }

      if (user.wallet?.address) {
        setBalance('0.01');
      }
    }
  }, [user]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-black/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-yellow-400 font-bold text-xl">Logo</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              to="/create"
              className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded-full text-sm font-medium"
            >
              <span>+ create</span>
            </Link>

            <Link
              to="/leaderboard"
              className="text-white hover:text-yellow-400 text-sm font-medium"
            >
              leaderboard
            </Link>

            {/* Right - Auth & Profile */}
            <div className="flex items-center gap-4">
              {authenticated ? (
                <div className="flex items-center gap-3">
                  {/* Combined Wallet & Profile Button */}
                  <Link
                    to="/my-page"
                    className="flex items-center gap-3 px-4 py-2 bg-gray-900 hover:bg-gray-800 transition-all duration-200 rounded-4xl"
                  >
                    {/* {balance && (
                      <span className="text-sm font-medium text-white">{balance} ET</span>
                    )} */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{userDisplayName}</span>
                      <div className="w-6 h-6 rounded-sm bg-blue-500 flex items-center justify-center overflow-hidden">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
                          alt="User Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </Link>

                  {/* Wallet Display */}
                  <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-full px-3 py-1.5">
                    <span className="text-yellow-400 text-sm font-medium">0.01 ET</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  </div>

                  {/* Logout Button */}
                  <button 
                    onClick={() => logout()}
                    className="text-white hover:text-yellow-400"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => login()}
                  className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white px-4 py-1.5 rounded-full text-sm font-medium"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;