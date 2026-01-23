import React from 'react';

interface WalletScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[70] bg-gradient-to-b from-orange-600/90 via-yellow-600/90 to-orange-900/90 flex items-center justify-center p-4 backdrop-blur-md">
      {/* Close Button */}
      <button 
        className="absolute top-4 right-4 z-[80] bg-white border-4 border-black p-2 hover:bg-gray-100 neubrutalist-btn"
        onClick={onClose}
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      {/* Holographic Wallet Interface */}
      <div className="relative w-full max-w-6xl h-full max-h-[80vh] bg-gradient-to-br from-black/20 via-orange-800/30 to-yellow-800/20 backdrop-blur-xl border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)] rounded-xl overflow-hidden">
        
        {/* HUD Elements */}
        <div className="absolute top-6 left-6 z-30">
          <div className="bg-black/60 border-2 border-yellow-400 px-4 py-2 backdrop-blur-sm">
            <span className="font-heading text-yellow-400 text-sm">FLOOR PRICE</span>
            <div className="text-white font-bold">0.05 ETH</div>
          </div>
        </div>
        
        <div className="absolute top-6 right-6 z-30">
          <div className="bg-black/60 border-2 border-yellow-400 px-4 py-2 backdrop-blur-sm">
            <span className="font-heading text-yellow-400 text-sm">RARITY SCORE</span>
            <div className="text-white font-bold">8.5/10</div>
          </div>
        </div>

        {/* Main Gallery Window */}
        <div className="flex items-center justify-center h-full p-8">
          <div className="bg-white/10 backdrop-blur-xl border-4 border-white/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <h2 className="font-heading text-4xl text-center mb-8 text-white">GALLERY</h2>
            
            {/* Character Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* The Latjie */}
              <div className="bg-gradient-to-br from-cyan-500/20 via-pink-500/20 to-purple-500/20 backdrop-blur-xl border-4 border-cyan-400 rounded-xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-105 transition-transform duration-300">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-pink-400 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="font-heading text-2xl text-white">1</span>
                </div>
                <h3 className="font-heading text-xl text-center text-cyan-400 mb-2">THE LATJIE</h3>
                <div className="text-center text-white text-sm">
                  <div className="mb-1">Level: Beginner</div>
                  <div className="mb-1">Rarity: Common</div>
                  <div className="text-cyan-400 font-bold">OWNED</div>
                </div>
              </div>

              {/* The Lepara */}
              <div className="bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-amber-500/20 backdrop-blur-xl border-4 border-yellow-400 rounded-xl p-6 shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-105 transition-transform duration-300">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="font-heading text-2xl text-white">2</span>
                </div>
                <h3 className="font-heading text-xl text-center text-yellow-400 mb-2">THE LEPARA</h3>
                <div className="text-center text-white text-sm">
                  <div className="mb-1">Level: Intermediate</div>
                  <div className="mb-1">Rarity: Rare</div>
                  <div className="text-gray-400 font-bold">LOCKED</div>
                </div>
              </div>

              {/* The Grootman */}
              <div className="bg-gradient-to-br from-purple-500/20 via-violet-500/20 to-indigo-500/20 backdrop-blur-xl border-4 border-purple-400 rounded-xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105 transition-transform duration-300">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-violet-400 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="font-heading text-2xl text-white">3</span>
                </div>
                <h3 className="font-heading text-xl text-center text-purple-400 mb-2">THE GROOTMAN</h3>
                <div className="text-center text-white text-sm">
                  <div className="mb-1">Level: Expert</div>
                  <div className="mb-1">Rarity: Legendary</div>
                  <div className="text-gray-400 font-bold">LOCKED</div>
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-8 flex justify-center gap-8">
              <div className="text-center">
                <div className="font-heading text-yellow-400 text-lg">TOTAL VALUE</div>
                <div className="text-white text-2xl font-bold">0.05 ETH</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-yellow-400 text-lg">COLLECTION</div>
                <div className="text-white text-2xl font-bold">1/3</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletScreen;