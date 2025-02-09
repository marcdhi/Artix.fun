"use client";
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';


// const Logo = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M8.5 10L12 13.5L15.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

const Navbar = () => {
  const { login, authenticated, user, logout } = usePrivy();
  const { wallets } = useWallets();
  const [scrolled, setScrolled] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [balance, setBalance] = useState<string>('0.00');

  console.log('balance', balance);

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallets && wallets.length > 0) {
        const wallet = wallets[0];
        try {
          const provider = await wallet.getEthereumProvider();
          const publicClient = await provider.request({ 
            method: 'eth_getBalance',
            params: [wallet.address, 'latest']
          });
          
          // Format balance from wei to ETH
          const formattedBalance = formatEther(BigInt(publicClient));
          // Round to 4 decimal places
          setBalance(Number(formattedBalance).toFixed(4));
        } catch (err) {
          console.error('Error fetching balance:', err);
          setBalance('0.00');
        }
      }
    };

    if (authenticated) {
      fetchBalance();
      // Refresh balance every 30 seconds
      const interval = setInterval(fetchBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [wallets, authenticated]);

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
    }
  }, [user]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#121212]/80 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={'/logo.svg'} alt="Logo" className="w-10 h-10" />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {authenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/create"
                  className="flex items-center gap-1 bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#121212] px-6 py-2 rounded-full text-sm font-semibold font-['Poppins'] transition-all duration-200"
                >
                  <span>+ create</span>
                </Link>

                <Link
                  to="/leaderboard"
                  className="text-white hover:text-[#FFD700] text-sm font-medium font-['Poppins'] transition-colors"
                >
                  leaderboard
                </Link>

                {/* Wallet Display */}
                <div className="flex items-center gap-2 bg-[#1A1A1A] backdrop-blur-sm rounded-full px-2 py-1 border border-[#FFD700]/20">
                  <span className="text-[#FFD700] text-sm font-semibold font-['Poppins']">{balance} ETH</span>
                  <span className="text-white/60 text-sm font-medium font-['Poppins']">{wallets?.[0]?.address?.slice(0, 6)}</span>
                  
                {/* User Avatar */}
                <div className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#1A1A1A]/80 transition-all duration-200 rounded-full px-3 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-[#010EFB] flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                </div>

                {/* Logout Icon */}
                <button
                  onClick={() => logout()}
                  className="text-white/60 hover:text-[#FFD700] transition-colors"
                  aria-label="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/leaderboard"
                  className="text-white hover:text-[#FFD700] text-sm font-medium font-['Poppins'] transition-colors"
                >
                  leaderboard
                </Link>
                
                <button
                  onClick={() => login()}
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#121212] px-6 py-2 rounded-full text-sm font-semibold font-['Poppins'] transition-all duration-200"
                >
                  connect wallet
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;