import React, { useEffect } from 'react';
import { useNFTs } from '../web3/useNFTs';

const NFTGallery: React.FC = () => {
  const { nfts, loading, error, fetchNFTs } = useNFTs();

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="font-heading text-2xl text-white bg-black/80 p-3 border-2 border-yellow-400">
        YOUR STASH
      </h2>

      {error && (
        <div className="bg-red-100 border-2 border-red-500 p-3 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="material-symbols-outlined animate-spin text-4xl mb-2">
              progress_activity
            </p>
            <p className="text-gray-600">Loading your characters...</p>
          </div>
        </div>
      ) : nfts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto">
          {nfts.map((nft) => (
            <div
              key={nft.tokenId}
              className="bg-white border-3 border-black rounded-lg p-2 hover:shadow-[4px_4px_0px_0px_black] transition-shadow"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-24 object-cover rounded border-2 border-black mb-2"
              />
              <h3 className="font-heading text-sm text-center">{nft.type}</h3>
              <p className="text-xs text-gray-600 text-center">#{nft.tokenId}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <p className="material-symbols-outlined text-4xl mb-2 opacity-50">
              collections
            </p>
            <p className="text-sm">No characters yet. Recruit your first below!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTGallery;
