import { useCallback, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';
import { baseSepolia } from 'wagmi/chains';

const ERC1155_ABI = parseAbi([
  'function LATJIE() view returns (uint256)',
  'function LEPARA() view returns (uint256)',
  'function balanceOf(address account, uint256 id) view returns (uint256)',
  'function joinAsLatjie(address player)',
  'function promoteToLepara(address player)',
  'function uri(uint256) view returns (string)'
]);

const CONTRACT_ADDRESS = '0x661925E1EF8405771a6dDcDfC6e19Ce81820e86E' as `0x${string}`;

export const useERC1155Mint = () => {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [error, setError] = useState<string | null>(null);

  const mintLatjie = useCallback(async () => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setError(null);

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ERC1155_ABI,
        functionName: 'joinAsLatjie',
        args: [address],
        account: address,
        chain: baseSepolia,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Minting failed';
      setError(errorMsg);
      console.error('Mint error:', err);
    }
  }, [address, writeContract]);

  const mintLepara = useCallback(async () => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setError(null);

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ERC1155_ABI,
        functionName: 'promoteToLepara',
        args: [address],
        account: address,
        chain: baseSepolia,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Promotion failed';
      setError(errorMsg);
      console.error('Promote error:', err);
    }
  }, [address, writeContract]);

  return {
    mintLatjie,
    mintLepara,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
    abi: ERC1155_ABI,
    contractAddress: CONTRACT_ADDRESS,
  };
};

export default useERC1155Mint;
