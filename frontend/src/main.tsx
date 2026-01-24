import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import App from './App'
import { wagmiConfig } from './web3/config'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <OnchainKitProvider 
        chain={baseSepolia}
        config={{ paymaster: import.meta.env.VITE_PAYMASTER_URL }}
      >
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </OnchainKitProvider>
    </WagmiProvider>
  </React.StrictMode>,
)