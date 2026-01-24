import { useCallback, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';
import { baseSepolia } from 'wagmi/chains';

const GROOTMAN_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function mintGrootman(address to, string uri)',
  'function tokenURI(uint256 tokenId) view returns (string)'
]);

const CONTRACT_ADDRESS = '0xa023dCF1486ef3150Ad6688c466F72b49C231Fc7' as `0x${string}`;

export const useGrootmanMint = () => {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [error, setError] = useState<string | null>(null);

  const mintGrootman = useCallback(
    async (to: `0x${string}`, uri: string) => {
      if (!address) {
        setError('Wallet not connected');
        return;
      }

      setError(null);

      try {
        await writeContract({
          address: CONTRACT_ADDRESS,
          abi: GROOTMAN_ABI,
          functionName: 'mintGrootman',
          args: [to, uri],
          account: address,
          chain: baseSepolia,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Grootman mint failed';
        setError(errorMsg);
        console.error('Grootman mint error:', err);
      }
    },
    [address, writeContract]
  );

  return {
    mintGrootman,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
    abi: GROOTMAN_ABI,
    contractAddress: CONTRACT_ADDRESS,
  };
};

export default useGrootmanMint;
