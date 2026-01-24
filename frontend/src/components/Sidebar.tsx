import React, { useState } from 'react';
import NFTGallery from './NFTGallery';
import GaslessMintPanel from './GaslessMintPanel';

interface SidebarProps {
  onOpenWallet: () => void;
  onOpenShop: () => void;
  rep: number;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenWallet, onOpenShop, rep }) => {
  const [activeTab, setActiveTab] = useState<'nav' | 'stash' | 'mint'>('nav');

  return (
    <aside className="hidden md:flex flex-col w-64 bg-yellow-400 border-r-4 border-black p-4 gap-4 overflow-y-auto">
      {activeTab === 'nav' ? (
        <>
          <nav className="flex flex-col gap-3">
            <button 
              className="neubrutalist-card bg-white p-3 flex items-center gap-3 hover:bg-blue-50 text-left"
              onClick={onOpenShop}
            >
              <span className="material-symbols-outlined text-3xl">storefront</span>
              <div>
                <div className="font-heading text-sm">Shop</div>
                <div className="text-xs text-gray-500">Hustle</div>
              </div>
            </button>
            <button 
              className="neubrutalist-card bg-white p-3 flex items-center gap-3 hover:bg-blue-50 text-left"
              onClick={() => setActiveTab('stash')}
            >
              <span className="material-symbols-outlined text-3xl">collections</span>
              <div>
                <div className="font-heading text-sm">Stash</div>
                <div className="text-xs text-gray-500">Your NFTs</div>
              </div>
            </button>
            <button 
              className="neubrutalist-card bg-white p-3 flex items-center gap-3 hover:bg-blue-50 text-left"
              onClick={() => setActiveTab('mint')}
            >
              <span className="material-symbols-outlined text-3xl">person_add</span>
              <div>
                <div className="font-heading text-sm">Recruit</div>
                <div className="text-xs text-gray-500">Free mint</div>
              </div>
            </button>
            <button className="neubrutalist-card bg-gray-100 p-3 flex items-center gap-3 opacity-60">
              <span className="material-symbols-outlined text-3xl">trophy</span>
              <span className="font-heading text-sm">Leaderboard</span>
            </button>
          </nav>
          <div className="mt-auto bg-white border-4 border-black p-4">
            <h3 className="font-heading text-sm mb-4 border-b-2 border-black pb-2">Rank</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="level-step w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-100 text-gray-400 border-4 border-gray-400">3</div>
                <span className="text-xs font-bold">Grootman</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="level-step w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-100 text-gray-400 border-4 border-gray-400">2</div>
                <span className="text-xs font-bold">Lepara</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="level-step active w-6 h-6 rounded-full flex items-center justify-center text-xs bg-taxi-yellow text-black border-4 border-black">1</div>
                <span className="text-xs font-bold">Latjie</span>
              </div>
            </div>
          </div>
        </>
      ) : activeTab === 'stash' ? (
        <>
          <button 
            onClick={() => setActiveTab('nav')}
            className="flex items-center gap-2 text-black hover:opacity-70"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-heading text-sm">Back</span>
          </button>
          <NFTGallery />
        </>
      ) : (
        <>
          <button 
            onClick={() => setActiveTab('nav')}
            className="flex items-center gap-2 text-black hover:opacity-70"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-heading text-sm">Back</span>
          </button>
          <GaslessMintPanel rep={rep} />
        </>
      )}
    </aside>
  );
};

export default Sidebar;