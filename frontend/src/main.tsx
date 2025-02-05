import React from 'react'
import ReactDOM from 'react-dom/client'
import {PrivyProvider} from '@privy-io/react-auth';

import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
          appId="cm6qjedst01xyec3lz1sub5l5"
          config={{
            // Display email and wallet as login methods
            loginMethods: ['email', 'wallet'],
            // Customize Privy's appearance in your app
            appearance: {
              theme: 'light',
              accentColor: '#676FFF',
              logo: 'https://your-logo-url',
            },
            // Create embedded wallets for users who don't have a wallet
            embeddedWallets: {
              createOnLogin: 'users-without-wallets',
            },
          }}
        >
          <App />
      </PrivyProvider>
  </React.StrictMode>,
)
