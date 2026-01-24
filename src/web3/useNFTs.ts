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
      const results: NFT[] = [];

      // Optional external indexer: prefer Moralis (if key present), else Alchemy (if key present).
      // This returns exact tokenIds + metadata and is much faster/reliable for ERC-721.
      const moralisKey = import.meta.env.VITE_MORALIS_KEY as string | undefined;
      const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY as string | undefined;
      // Default to Base Sepolia for this project unless overridden in env
      const alchemyNetwork = (import.meta.env.VITE_ALCHEMY_NETWORK as string) || 'base-sepolia';

      const tryIndexer = async () => {
        if (moralisKey) {
          try {
            const chainParam = (import.meta.env.VITE_MORALIS_CHAIN as string) || 'base-sepolia';
            const url = `https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chainParam}&format=decimal`;
            const res = await fetch(url, { headers: { 'X-API-Key': moralisKey } });
            if (!res.ok) throw new Error(`Moralis error ${res.status}`);
            const data = await res.json();
            const formatted: NFT[] = (data.result || data.nfts || []).map((nft: any) => {
              const name = nft.metadata?.name || nft.name || nft.title || 'Unknown';
              const image = nft.metadata?.image || nft.image || nft.token_uri || '/assets/placeholder.png';
              let type: 'Latjie' | 'Lepara' | 'Grootman' = 'Latjie';
              if (String(name).includes('Lepara')) type = 'Lepara';
              if (String(name).includes('Grootman')) type = 'Grootman';
              return {
                tokenId: String(nft.token_id || nft.tokenId || nft.tokenIdRaw || ''),
                name,
                image,
                contractAddress: String(nft.token_address || nft.contract || nft.contractAddress || ''),
                type,
              };
            });
            results.push(...formatted);
            return;
          } catch (e) {
            console.debug('Moralis lookup failed, falling back', e);
          }
        }

        if (alchemyKey) {
          try {
            // Example Alchemy getNFTs endpoint: https://{network}.g.alchemy.com/v2/{key}/getNFTs?owner={address}
            const url = `https://${alchemyNetwork}.g.alchemy.com/v2/${alchemyKey}/getNFTs?owner=${address}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Alchemy error ${res.status}`);
            const data = await res.json();
            const owned = data.ownedNfts || data.owned_nfts || data.nfts || [];
            const formatted: NFT[] = owned.map((nft: any) => {
              const metadata = nft.metadata || nft.token?.metadata || {};
              const name = metadata.name || nft.title || nft.contract?.name || 'Unknown';
              const image = metadata.image || nft.media?.[0]?.gateway || '/assets/placeholder.png';
              let type: 'Latjie' | 'Lepara' | 'Grootman' = 'Latjie';
              if (String(name).includes('Lepara')) type = 'Lepara';
              if (String(name).includes('Grootman')) type = 'Grootman';

              // normalize tokenId: Alchemy often returns hex like "0x1"
              let rawId = nft.id?.tokenId || nft.tokenId || nft.token_id || '';
              let tokenIdStr = '';
              try {
                if (typeof rawId === 'string' && rawId.startsWith('0x')) {
                  tokenIdStr = BigInt(rawId).toString();
                } else if (typeof rawId === 'number') {
                  tokenIdStr = String(rawId);
                } else {
                  tokenIdStr = String(rawId || '');
                }
              } catch (e) {
                tokenIdStr = String(rawId || '');
              }

              return {
                tokenId: tokenIdStr,
                name,
                image,
                contractAddress: String(nft.contract?.address || nft.contractAddress || ''),
                type,
              };
            });
            results.push(...formatted);
            return;
          } catch (e) {
            console.debug('Alchemy lookup failed, falling back', e);
          }
        }
      };

      await tryIndexer();

      // Normalize image URIs (handle ipfs://, /ipfs/, Pinata gateways, {id} templates, json metadata pointers)
      const IPFS_GATEWAY = 'https://dweb.link/ipfs/';

      async function normalizeImageUri(raw: string | undefined, tokenId?: string): Promise<string> {
        if (!raw) return '/assets/placeholder.png';
        const val = String(raw).trim();
        if (!val) return '/assets/placeholder.png';
        if (val.startsWith('data:')) return val;

        if (val.startsWith('ipfs://')) {
          const path = val.replace(/^ipfs:\/\/(?:ipfs\/)?/, '');
          return IPFS_GATEWAY + path;
        }

        if (val.startsWith('/ipfs/')) {
          return IPFS_GATEWAY + val.replace(/^\/ipfs\//, '');
        }

        if (val.includes('pinata') && val.includes('/ipfs/')) return val;

        if (val.includes('{id}') && tokenId) {
          try {
            const hex = BigInt(tokenId).toString(16).padStart(64, '0');
            const replaced = val.replace(/\{id\}/g, hex);
            return normalizeImageUri(replaced, undefined);
          } catch (e) {
            // ignore
          }
        }

        if (/(\.json$)|metadata/i.test(val) || val.includes('token') || val.includes('metadata')) {
          try {
            const res = await fetch(val);
            if (res.ok) {
              const json = await res.json();
              const image = json.image || json.image_url || json.imageUrl || json.image_url;
              if (image) return normalizeImageUri(image, tokenId);
            }
          } catch (e) {
            // ignore
          }
        }

        if (val.startsWith('http://') || val.startsWith('https://')) return val;

        return '/assets/placeholder.png';
      }

      // Normalize images for any results returned by indexer
      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          try {
            results[i].image = await normalizeImageUri(results[i].image, results[i].tokenId);
          } catch (e) {
            results[i].image = '/assets/placeholder.png';
          }
        }
      }


      // Also check the on-chain ERC-1155 contract for owned Latjie/Lepara tokens
      try {
        if (!publicClient) {
          throw new Error("Public client not initialized");
        }

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
            const type: 'Latjie' | 'Lepara' = id === latjieId ? 'Latjie' : 'Lepara';
            results.push({
              tokenId: tokenIdStr,
              name: type,
              image: uri || '/assets/placeholder.png',
              contractAddress: CONTRACT_ADDRESS,
              type,
            });
          }
        }
      } catch (e) {
        console.warn('ERC1155 ownership check failed', e);
      }

      // Also check an ERC-721 Grootman contract for ownership (display placeholder if present)
      try {
        if (!publicClient) {
          throw new Error("Public client not initialized");
        }

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
          // Best-effort: try to surface an image. Token IDs may not be enumerable on-chain
          // without ERC-721 Enumerable; use a placeholder if tokenURI can't be read reliably.
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

          results.push({
            tokenId: 'grootman',
            name: 'Grootman',
            image: uri || '/assets/placeholder.png',
            contractAddress: GROOT_ADDR,
            type: 'Grootman',
          });
        }
      } catch (e) {
        console.warn('ERC721 Grootman check failed', e);
      }
            // Final normalization for images added by on-chain fallbacks
      for (let i = 0; i < results.length; i++) {
        try {
          results[i].image = await normalizeImageUri(results[i].image, results[i].tokenId);
        } catch (e) {
          results[i].image = '/assets/placeholder.png';
        }
      }

      // Dedupe by contract+tokenId
      const seen = new Set<string>();
      const deduped = results.filter(r => {
        const key = `${r.contractAddress.toLowerCase()}::${r.tokenId}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setNfts(deduped);
    } catch (err) {
      console.error('Failed to fetch NFTs:', err);
      setError('Could not load your NFTs');
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
