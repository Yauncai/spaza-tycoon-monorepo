import { useCallback, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { parseAbi } from 'viem';
import { baseSepolia } from 'wagmi/chains';

export interface NFT {
  tokenId: string;
  name: string;
  image: string;
  contractAddress: string;
  type: 'Latjie' | 'Lepara' | 'Grootman';
}

export const useNFTs = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId: baseSepolia.id });
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch NFTs from Base Sepolia using Alchemy or similar
      // For now, we'll use a mock response structure
      // In production, replace with actual API call
      
      const response = await fetch(
        `https://api.zora.co/v1/nfts?owner=${address}&chain=baseSepolia`
      );

      if (response.ok) {
        const data = await response.json();
        const formattedNFTs: NFT[] = (data.nfts || []).map((nft: any) => {
          let type: 'Latjie' | 'Lepara' | 'Grootman' = 'Latjie';
          if (nft.name?.includes('Lepara')) type = 'Lepara';
          if (nft.name?.includes('Grootman')) type = 'Grootman';

          return {
            tokenId: nft.tokenId,
            name: nft.name || 'Unknown',
            image: nft.image || '/assets/placeholder.png',
            contractAddress: nft.contractAddress,
            type,
          };
        });

        setNfts(formattedNFTs);
      }

      // Also check the on-chain ERC-1155 contract for owned Latjie/Lepara tokens
      try {
        const ERC1155_ABI = parseAbi([
          'function LATJIE() view returns (uint256)',
          'function LEPARA() view returns (uint256)',
          'function balanceOf(address account, uint256 id) view returns (uint256)',
          'function uri(uint256) view returns (string)'
        ]);
        const CONTRACT_ADDRESS = '0x661925E1EF8405771a6dDcDfC6e19Ce81820e86E' as `0x${string}`;

        const latjieId = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: ERC1155_ABI,
          functionName: 'LATJIE',
          args: [],
        }) as bigint;

        const leparaId = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: ERC1155_ABI,
          functionName: 'LEPARA',
          args: [],
        }) as bigint;

        const idsToCheck = [latjieId, leparaId];

        for (const id of idsToCheck) {
          const bal = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: ERC1155_ABI,
            functionName: 'balanceOf',
            args: [address, id],
          }) as bigint;

          if (bal && bal > 0n) {
            let uri = '';
            try {
              uri = (await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: ERC1155_ABI,
                functionName: 'uri',
                args: [id],
              })) as string;
            } catch (e) {
              uri = '';
            }

            const tokenIdStr = id.toString();
            const type: 'Latjie' | 'Lepara' | 'Grootman' = id === latjieId ? 'Latjie' : 'Lepara';
            setNfts(prev => [
              ...prev,
              {
                tokenId: tokenIdStr,
                name: type,
                image: uri || '/assets/placeholder.png',
                contractAddress: CONTRACT_ADDRESS,
                type,
              },
            ]);
          }
        }
      } catch (e) {
        console.warn('ERC1155 ownership check failed', e);
      }

      // Also check an ERC-721 Grootman contract for ownership (display placeholder if present)
      try {
        const GROOT_ABI = parseAbi([
          'function balanceOf(address owner) view returns (uint256)',
          'function tokenURI(uint256 tokenId) view returns (string)'
        ]);
        const GROOT_ADDR = '0xa023dCF1486ef3150Ad6688c466F72b49C231Fc7' as `0x${string}`;

        const grootBalance = await publicClient.readContract({
          address: GROOT_ADDR,
          abi: GROOT_ABI,
          functionName: 'balanceOf',
          args: [address],
        }) as bigint;

        if (grootBalance && grootBalance > 0n) {
          // Attempt to read a tokenURI(1) as a best-effort image; otherwise use placeholder.
          let uri = '';
          try {
            uri = (await publicClient.readContract({
              address: GROOT_ADDR,
              abi: GROOT_ABI,
              functionName: 'tokenURI',
              args: [1n],
            })) as string;
          } catch (e) {
            uri = '/assets/placeholder.png';
          }

          setNfts(prev => [
            ...prev,
            {
              tokenId: 'grootman',
              name: 'Grootman',
              image: uri || '/assets/placeholder.png',
              contractAddress: GROOT_ADDR,
              type: 'Grootman',
            },
          ]);
        }
      } catch (e) {
        console.warn('ERC721 Grootman check failed', e);
      }
    } catch (err) {
      console.error('Failed to fetch NFTs:', err);
      setError('Could not load your NFTs');
      // Set empty array on error
      setNfts([]);
    } finally {
      setLoading(false);
    }
  }, [address]);

  return {
    nfts,
    loading,
    error,
    fetchNFTs,
  };
};
