import { usePrivy } from '@privy-io/react-auth';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Logo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.5 10L12 13.5L15.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Navbar() {
  const { authenticated, login, logout, user } = usePrivy();
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [balance, setBalance] = useState<string>('0.00');
  
  useEffect(() => {
    if (user) {
      // Set user display name based on available data
      if (user.google) {
        setUserDisplayName(user.google.email.split('@')[0]);
      } else if (user.email) {
        setUserDisplayName(user.email.address.split('@')[0]);
      } else if (user.wallet) {
        setUserDisplayName(user.wallet.address.slice(0, 6));
      } else {
        setUserDisplayName(user.id.slice(0, 6));
      }

      // Set wallet balance if available
      if (user.wallet?.address) {
        // Here you would fetch actual balance
        setBalance('0.01');
      }
    }
  }, [user]);

  return (
    <header className="sticky top-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="max-w-screen-xl h-full mx-auto px-6">
        <div className="h-full flex items-center justify-between">
          {/* Left - Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo />
            <span className="text-sm font-semibold text-gray-900">Artix.fun</span>
          </Link>

          {/* Right Navigation */}
          <nav className="flex items-center gap-8 ml-auto mr-10">
            <Link
              to="/leaderboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              to="/create"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              + Create
            </Link>
          </nav>

          {/* Right - Auth & Profile */}
          <div className="flex items-center gap-4">
            {authenticated ? (
              <div className="flex items-center gap-3">
                {/* Combined Wallet & Profile Button */}
                <Link
                  to="/my-page"
                  className="flex items-center gap-3 px-4 py-2 bg-gray-900 hover:bg-gray-800 transition-all duration-200"
                >
                  {balance && (
                    <span className="text-sm font-medium text-white">{balance} ET</span>
                  )}
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
                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-200"
                  title="Logout"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 cursor-pointer"
              >
                Connect wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}