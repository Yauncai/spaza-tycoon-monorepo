import { useCallback, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { encodeFunctionData, parseAbi } from 'viem';
import { baseSepolia } from 'wagmi/chains';

// Mock contract ABI for gasless minting
const MINT_CONTRACT_ABI = parseAbi([
  'function mint(address to, string memory characterType) public payable returns (uint256)',
  'function balanceOf(address owner) public view returns (uint256)',
]);

export const useGaslessMint = () => {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const [error, setError] = useState<string | null>(null);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);

  const mintCharacter = useCallback(
    async (characterType: 'Latjie' | 'Lepara' | 'Grootman') => {
      if (!address) {
        setError('Wallet not connected');
        return;
      }

      setError(null);

      try {
        // Mock contract address on Base Sepolia
        const contractAddress = '0x0000000000000000000000000000000000000000' as `0x${string}`;

        // Call mint function with sponsored transaction (Paymaster handles gas)
        writeContract({
          address: contractAddress,
          abi: MINT_CONTRACT_ABI,
          functionName: 'mint',
          args: [address, characterType],
          account: address,
          chain: baseSepolia,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Minting failed';
        setError(errorMsg);
        console.error('Mint error:', err);
      }
    },
    [address, writeContract]
  );

  return {
    mintCharacter,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
    mintedTokenId,
  };
};
