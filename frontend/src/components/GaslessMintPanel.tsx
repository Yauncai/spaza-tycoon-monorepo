import React from 'react';
import { useGaslessMint } from '../web3/useGaslessMint';

const GaslessMintPanel: React.FC = () => {
  const { mintCharacter, isPending, isSuccess, error } = useGaslessMint();

  const characters = [
    {
      name: 'Latjie',
      description: 'The street hustler',
      emoji: '🧑‍🤝‍🧑',
    },
    {
      name: 'Lepara',
      description: 'The wise elder',
      emoji: '👵',
    },
    {
      name: 'Grootman',
      description: 'The boss',
      emoji: '👔',
    },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="font-heading text-2xl text-white bg-black/80 p-3 border-2 border-yellow-400">
        RECRUIT CHARACTER
      </h2>

      <p className="text-sm text-gray-600">
        Mint new characters for free. Gas fees sponsored.
      </p>

      {error && (
        <div className="bg-red-100 border-2 border-red-500 p-3 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-100 border-2 border-green-500 p-3 rounded-lg text-green-700 text-sm">
          Character minted successfully!
        </div>
      )}

      <div className="flex flex-col gap-2">
        {characters.map((char) => (
          <button
            key={char.name}
            onClick={() => mintCharacter(char.name as any)}
            disabled={isPending}
            className={`neubrutalist-btn px-4 py-3 text-sm font-heading ${
              isPending
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-yellow-400 text-black hover:bg-yellow-500 active:translate-x-1 active:translate-y-1'
            } border-2 border-black rounded-lg`}
          >
            {isPending ? (
              <>
                <span className="material-symbols-outlined text-sm inline">
                  progress_activity
                </span>
                {' '}Minting {char.name}...
              </>
            ) : (
              <>
                {char.emoji} Mint {char.name}
              </>
            )}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-auto">
        Powered by Coinbase Paymaster on Base Sepolia
      </p>
    </div>
  );
};

export default GaslessMintPanel;
