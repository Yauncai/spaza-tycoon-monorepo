import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';

interface WalletGateProps {
  onConnect: () => void;
}

const WalletGate: React.FC<WalletGateProps> = ({ onConnect }) => {
  const [loading, setLoading] = useState(false);
  const { playSound } = useSound();

  const handleConnect = async () => {
    playSound('pop');
    setLoading(true);
    
    // Wait 10s
    await new Promise(r => setTimeout(r, 7000));
    
    playSound('success');
    onConnect();
  };

  return (
    <div className="absolute inset-0 z-[60] bg-zinc-900/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-yellow-400 p-8 border-4 border-black shadow-[10px_10px_0px_0px_white] text-center max-w-md w-full transition-all duration-300">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <h1 className="font-heading text-5xl mb-4 animate-bounce text-center">HEITA!</h1>
            <p className="font-bold text-xl uppercase text-center mb-4">You are on a laaitie level!</p>
            <div className="w-full bg-black h-2 mt-4 overflow-hidden">
              <div className="h-full bg-white animate-[loadingBar_10s_linear_forwards] w-0"></div>
            </div>
            <p className="text-[10px] font-mono mt-2">Initializing Hustle...</p>
          </div>
        ) : (
          <>
            <h1 className="font-heading text-4xl mb-2">SPAZA TYCOON</h1>
            <p className="font-bold text-sm mb-6 uppercase tracking-widest">Web3 Hustle Simulator</p>
            <div className="mb-8 p-4 bg-white border-2 border-black text-xs font-mono text-left">
              &gt; SYSTEM CHECK...<br/>
              &gt; WALLET DISCONNECTED<br/>
              &gt; ACCESS DENIED<br/>
              &gt; AWAITING HUSTLER...
            </div>
            <button 
              className="neubrutalist-btn bg-black text-white w-full py-4 text-xl hover:bg-zinc-800 flex items-center justify-center gap-2"
              onClick={handleConnect}
            >
              <span className="material-symbols-outlined">account_balance_wallet</span>
              Start your hustle
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletGate;