import React from 'react';
import { useAccount } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import type { Abi, Address } from 'viem';
import { zeroAddress } from 'viem';
import { Transaction, TransactionButton, TransactionStatus } from '@coinbase/onchainkit/transaction';

const NFT_CONTRACT = '0x...EXP' as Address;

const ERC721_MINT_ABI: Abi = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
];

interface MintLatjieProps {
  onSuccess?: () => void;
}

const MintLatjie: React.FC<MintLatjieProps> = ({ onSuccess }) => {
  const { address } = useAccount();
  const toAddress: Address = address ?? zeroAddress;

  return (
    <Transaction
      chainId={baseSepolia.id}
      calls={[
        {
          to: NFT_CONTRACT,
          abi: ERC721_MINT_ABI,
          functionName: 'mint',
          args: [toAddress],
        },
      ]}
      isSponsored
      onSuccess={onSuccess}
    >
      <div className="flex flex-col gap-3">
        <TransactionButton
          text={address ? 'Recruit Latjie (Gasless)' : 'Connect wallet to mint'}
          className="neubrutalist-btn bg-yellow-400 border-4 border-black font-sign text-black px-4 py-3 hover:-translate-y-0.5 hover:translate-x-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!address}
        />
        <TransactionStatus />
      </div>
    </Transaction>
  );
};

export default MintLatjie;
