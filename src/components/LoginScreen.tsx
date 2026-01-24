import React, { useEffect } from 'react';
import { useSmartWallet } from '../web3/useSmartWallet';

interface LoginScreenProps {
  onConnect: (address: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onConnect }) => {
  const { connectWallet, loading, error, wallet } = useSmartWallet();

  useEffect(() => {
    if (wallet?.address) {
      onConnect(wallet.address);
    }
  }, [wallet, onConnect]);

  return (
    <div className="fixed inset-0 z-[999] bg-gradient-to-b from-sky-200 to-sky-100 flex items-center justify-center min-h-screen font-body">
      <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-24 h-24 bg-yellow-400 border-4 border-black flex items-center justify-center font-heading text-6xl mb-4">
            S
          </div>
          <h1 className="text-center">
            <span className="text-5xl font-heading tracking-tighter">SPAZA</span>
            <span className="text-5xl font-heading text-blue-600">TYCOON</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-center font-heading text-xl mb-12 text-gray-700">
          Build Your Empire. Serve Your Kasi.
        </p>

        {/* Login Card */}
        <div className="bg-white border-4 border-black p-8 rounded-xl shadow-[12px_12px_0px_0px_black] max-w-md w-full">
          <h2 className="font-heading text-3xl mb-6 text-center">SHARPEN UP</h2>

          {error && (
            <div className="bg-red-100 border-2 border-red-500 p-3 rounded-lg mb-4">
              <p className="text-red-700 text-sm font-bold">{error}</p>
            </div>
          )}

          <p className="text-center mb-8 text-gray-600">
            Log in with your Web3 Passport to start your business.
          </p>

          <button
            onClick={connectWallet}
            disabled={loading}
            className={`w-full neubrutalist-btn text-lg font-heading py-4 px-6 flex items-center justify-center gap-2 ${
              loading
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-yellow-400 text-black hover:bg-yellow-500 active:translate-x-1 active:translate-y-1 active:shadow-[8px_8px_0px_0px_black]'
            }`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">
                  progress_activity
                </span>
                Connecting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">fingerprint</span>
                Login with Passkey
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Secured by Coinbase Smart Wallet on Base
          </p>
        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-gray-600 max-w-md">
          No extensions needed. One passkey. Full control.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
