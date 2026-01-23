import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

interface BasenameData {
  name: string | null;
  avatar: string | null;
}

export const useBasename = () => {
  const { address } = useAccount();
  const [basenameData, setBasenameData] = useState<BasenameData>({
    name: null,
    avatar: null,
  });
  const [loading, setLoading] = useState(false);

  const resolveBasename = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    try {
      // Fetch basename from OnchainKit API
      const response = await fetch(
        `https://api.basenames.domains/v1/names/${address}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setBasenameData({
          name: data.name || null,
          avatar: data.avatar || null,
        });
      } else {
        // No basename found, use address
        setBasenameData({
          name: null,
          avatar: null,
        });
      }
    } catch (error) {
      console.error('Failed to resolve basename:', error);
      setBasenameData({
        name: null,
        avatar: null,
      });
    } finally {
      setLoading(false);
    }
  }, [address]);

  const getDisplayName = useCallback(() => {
    if (basenameData.name) return basenameData.name;
    if (address) return `${address.slice(0, 6)}...${address.slice(-4)}`;
    return 'Connected';
  }, [basenameData.name, address]);

  const getAvatarGradient = useCallback(() => {
    if (!address) return 'from-purple-400 to-pink-400';
    
    // Generate gradient based on address hash
    const hash = parseInt(address.slice(2, 10), 16);
    const colors = [
      'from-purple-400 to-pink-400',
      'from-blue-400 to-cyan-400',
      'from-green-400 to-teal-400',
      'from-yellow-400 to-orange-400',
      'from-red-400 to-pink-400',
    ];
    return colors[hash % colors.length];
  }, [address]);

  return {
    basenameData,
    loading,
    resolveBasename,
    getDisplayName,
    getAvatarGradient,
  };
};
