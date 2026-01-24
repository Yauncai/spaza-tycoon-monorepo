import React, { useEffect } from 'react';
import { useBasename } from '../web3/useBasename';
import { useAccount } from 'wagmi';

interface HeaderProps {
  score: number;
  onOpenGlossary: () => void;
  spzaBalance: number;
  rep: number;
}

const Header: React.FC<HeaderProps> = ({ score, onOpenGlossary, spzaBalance, rep }) => {
  const { address } = useAccount();
  const { basenameData, resolveBasename, getDisplayName, getAvatarGradient } = useBasename();

  useEffect(() => {
    if (address) {
      resolveBasename();
    }
  }, [address, resolveBasename]);

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-yellow-400 border-4 border-black flex items-center justify-center font-heading text-xl">S</div>
        <h1 className="text-2xl tracking-tighter font-heading">SPAZA<span className="text-blue-600">TYCOON</span></h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          className="neubrutalist-btn bg-white px-2 py-1 flex items-center gap-1 text-xs"
          onClick={onOpenGlossary}
        >
          <span className="material-symbols-outlined text-sm">menu_book</span>
          Slang
        </button>

        {address && (
          <div className="hidden md:flex items-center gap-2 bg-blue-100 px-3 py-1 border-2 border-black rounded-full">
            {basenameData.avatar ? (
              <img 
                src={basenameData.avatar} 
                alt="avatar" 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarGradient()}`} />
            )}
            <span className="text-[10px] uppercase font-bold text-blue-800">
              {getDisplayName()}
            </span>
          </div>
        )}

        <div className="hidden md:flex items-center gap-2 bg-purple-100 px-3 py-1 border-2 border-black rounded-full">
          <span className="text-[10px] uppercase font-bold text-purple-800">Rep</span>
          <span className="font-heading text-lg">{rep}</span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-green-100 px-3 py-1 border-2 border-black rounded-full">
          <span className="text-[10px] uppercase font-bold text-green-800">$SPZA</span>
          <span className="font-heading text-lg">{spzaBalance}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;