import { useCallback } from 'react';
import { useAccount, useConnect } from 'wagmi';

export const useSmartWallet = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();

  const connectWallet = useCallback(async () => {
    try {
      // Use first available connector (Coinbase Smart Wallet via OnchainKit)
      const coinbaseConnector = connectors.find(
        (c) => c.id === 'coinbaseWalletSDK'
      );
      if (coinbaseConnector) {
        connect({ connector: coinbaseConnector });
      } else {
        // Fallback to first connector
        connect({ connector: connectors[0] });
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  }, [connect, connectors]);

  const disconnect = useCallback(() => {
    // Disconnect handled by wagmi's disconnect hook
  }, []);

  return {
    wallet: address ? { address, name: 'Smart Wallet' } : null,
    loading: isPending,
    error: error?.message || null,
    connectWallet,
    disconnect,
    isConnected,
  };
};
