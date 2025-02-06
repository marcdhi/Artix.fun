import {usePrivy} from '@privy-io/react-auth';
import {motion} from 'framer-motion';

function LoginButton() {
  const {ready, authenticated, login} = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <motion.button
      type="button"
      disabled={disableLogin}
      onClick={login}
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.95}}
      className={`
        px-4 py-2 text-sm font-medium rounded-full
        ${disableLogin 
          ? 'bg-white/5 text-white/50 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-purple-500/25'
        }
        transition-all duration-300
      `}
    >
      {!ready ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : authenticated ? (
        'Connected'
      ) : (
        'Connect Wallet'
      )}
    </motion.button>
  );
}

export default LoginButton;