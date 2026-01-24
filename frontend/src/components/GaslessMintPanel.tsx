import React from 'react';
import useERC1155Mint from '../web3/useERC1155Mint';
import useGrootmanMint from '../web3/useGrootmanMint';
import { useNFTs } from '../web3/useNFTs';

interface Props { rep: number }

const GaslessMintPanel: React.FC<Props> = ({ rep }) => {
  const { mintLatjie, mintLepara, isPending: erc1155Pending, error: erc1155Error } = useERC1155Mint();
  const { mintGrootman, isPending: grootPending, error: grootError } = useGrootmanMint();
  const { nfts, fetchNFTs } = useNFTs();

  React.useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  const hasLatjie = nfts.some(n => n.type === 'Latjie');
  const hasLepara = nfts.some(n => n.type === 'Lepara');
  const hasGroot = nfts.some(n => n.type === 'Grootman');

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="font-heading text-2xl text-white bg-black/80 p-3 border-2 border-yellow-400">
        RECRUIT CHARACTER
      </h2>

      <p className="text-sm text-gray-600">
        Mint new characters for free. Gas fees sponsored.
      </p>

      {(erc1155Error || grootError) && (
        <div className="bg-red-100 border-2 border-red-500 p-3 rounded-lg text-red-700 text-sm">
          {erc1155Error || grootError}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={async () => { if (!hasLatjie) { await mintLatjie(); fetchNFTs(); } }}
          disabled={erc1155Pending || hasLatjie}
          className={`neubrutalist-btn px-4 py-3 text-sm font-heading ${
            erc1155Pending
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-yellow-400 text-black hover:bg-yellow-500 active:translate-x-1 active:translate-y-1'
          } border-2 border-black rounded-lg`}
        >
          {hasLatjie ? 'Latjie (Owned)' : (erc1155Pending ? 'Minting Latjie...' : '🧑‍🤝‍🧑 Mint Latjie (Free)')}
        </button>

        <button
          onClick={async () => { if (!hasLepara && rep >= 1000) { await mintLepara(); fetchNFTs(); } }}
          disabled={erc1155Pending || hasLepara || rep < 1000}
          className={`neubrutalist-btn px-4 py-3 text-sm font-heading ${
            erc1155Pending || rep < 1000
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-yellow-400 text-black hover:bg-yellow-500 active:translate-x-1 active:translate-y-1'
          } border-2 border-black rounded-lg`}
        >
          {hasLepara ? 'Lepara (Owned)' : (rep < 1000 ? 'Lepara (1000 Rep)' : '👵 Promote to Lepara')}
        </button>

        <button
          onClick={async () => { if (!hasGroot && rep >= 5000) { await mintGrootman((window as any).ethereum?.selectedAddress || '', 'ipfs://bafkreidu7vwogndcpfllabbysjhcbevdxhk4o5qpzczsjtzwhzia3fz4ri'); fetchNFTs(); } }}
          disabled={grootPending || hasGroot || rep < 5000}
          className={`neubrutalist-btn px-4 py-3 text-sm font-heading ${
            grootPending || rep < 5000
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-yellow-400 text-black hover:bg-yellow-500 active:translate-x-1 active:translate-y-1'
          } border-2 border-black rounded-lg`}
        >
          {hasGroot ? 'Grootman (Owned)' : (rep < 5000 ? 'Grootman (5000 Rep)' : '👔 Mint Grootman')}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-auto">
        Powered by Coinbase Paymaster on Base Sepolia
      </p>
    </div>
  );
};

export default GaslessMintPanel;
