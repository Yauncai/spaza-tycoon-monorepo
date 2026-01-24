import React from 'react';
import { useAccount } from 'wagmi';
import { useNFTs } from '../web3/useNFTs';
import { useERC1155Mint } from '../web3/useERC1155Mint';

interface MintLatjieProps {
  onSuccess?: () => void;
}

const MintLatjie: React.FC<MintLatjieProps> = ({ onSuccess }) => {
  const { address } = useAccount();
  const { nfts, fetchNFTs } = useNFTs();
  const { mintLatjie, isPending, isSuccess, error } = useERC1155Mint();
  const hasLatjie = nfts.some(n => n.type === 'Latjie');

  const handleMint = async () => {
    if (!address || hasLatjie) return;
    await mintLatjie();
    fetchNFTs();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleMint}
        disabled={isPending || !address || hasLatjie}
        className="neubrutalist-btn bg-yellow-400 border-4 border-black font-sign text-black px-4 py-3 hover:-translate-y-0.5 hover:translate-x-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? 'Recruiting Latjie...' : hasLatjie ? 'Latjie owned' : (address ? 'Recruit Latjie (Gasless)' : 'Connect wallet to mint')}
      </button>
      {isSuccess && <p className="text-green-600 font-bold">Latjie recruited successfully!</p>}
      {error && <p className="text-red-600 font-bold">{error}</p>}
    </div>
  );
};

export default MintLatjie;
