import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

export interface NFT {
  tokenId: string;
  name: string;
  image: string;
  contractAddress: string;
  type: 'Latjie' | 'Lepara' | 'Grootman';
}

export const useNFTs = () => {
  const { address } = useAccount();
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
