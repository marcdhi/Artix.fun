import {usePrivy} from '@privy-io/react-auth';

function LoginButton() {
  const {ready, authenticated, login} = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <button
      type="button"
      disabled={disableLogin}
      onClick={login}
      className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-full font-medium border border-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Log in
    </button>
  );
}

export default LoginButton;