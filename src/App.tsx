import React, { useState, useCallback, useRef, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import useERC1155Mint from './web3/useERC1155Mint';
import { useWeather } from './hooks/useWeather';
import GlossaryModal from './components/GlossaryModal';
import WalletScreen from './components/WalletScreen';
import ShopScreen from './components/ShopScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GameArea from './components/GameArea';
import { GameState, Character, ItemType } from './types';
import { CHARACTERS, ITEMS, PHRASES } from './data/gameData';
import { useSound } from './hooks/useSound';
import useGrootmanMint from './web3/useGrootmanMint';
import { useAccount } from 'wagmi';
import { useNFTs } from './web3/useNFTs';

const INITIAL_STOCK: Record<ItemType, number> = {
  Bread: 15,
  Coke: 8,
  Milk: 12,
  Eggs: 6,
  Goslos: 4,
  Benny: 3
};

const ITEM_PRICE: Record<ItemType, number> = {
  Bread: 5,
  Coke: 3,
  Milk: 4,
  Eggs: 6,
  Goslos: 8,
  Benny: 10
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    walletConnected: false,
    playing: false,
    score: 0,
    timeLeft: 10,
    currentOrder: null,
    timer: null,
    hearts: 5
  });

  const [currentCustomer, setCurrentCustomer] = useState<Character | null>(null);
  const [currentDialogue, setCurrentDialogue] = useState<string>('');
  const [showCustomer, setShowCustomer] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [spzaBalance, setSpzaBalance] = useState(0);
  const [rep, setRep] = useState(0);
  const [consecutiveServes, setConsecutiveServes] = useState(0);
  const [showMintPrompt, setShowMintPrompt] = useState(false);
  const [promotedToLepara, setPromotedToLepara] = useState(false);
  const [promotedToGrootman, setPromotedToGrootman] = useState(false);
  const [shakeMain, setShakeMain] = useState(false);
  const [stock, setStock] = useState<Record<ItemType, number>>(INITIAL_STOCK);
  const [outOfStockItem, setOutOfStockItem] = useState<ItemType | null>(null);

  const { playSound } = useSound();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chirpRef = useRef<HTMLAudioElement | null>(null);

  const weather = useWeather();
  const { nfts, fetchNFTs } = useNFTs();

  const stopChirping = useCallback(() => {
    if (chirpRef.current) {
      chirpRef.current.pause();
      chirpRef.current.currentTime = 0;
      chirpRef.current = null;
    }
  }, []);

  const startChirping = useCallback(() => {
    stopChirping();
    const bg = new Audio('/assets/chirping.mp3');
    bg.loop = true;
    bg.volume = 0.5;
    bg.play().catch(err => console.log('Chirping play failed:', err));
    chirpRef.current = bg;
  }, [stopChirping]);

  const handleWalletConnect = useCallback((address: string) => {
    setGameState(prev => ({ ...prev, walletConnected: true }));
    setShowMintPrompt(true);
    fetchNFTs();
  }, [fetchNFTs]);

  // mint hooks
  const { mintLatjie, mintLepara, isPending: mintPending, error: mintError } = useERC1155Mint();
  const { mintGrootman } = useGrootmanMint();
  const { address: accountAddress } = useAccount();

  // Auto-trigger Lepara / Grootman based on `rep` thresholds and ownership
  useEffect(() => {
    if (!gameState.walletConnected) return;
    const LEPARA_THRESHOLD = 1000;
    const GROOT_THRESHOLD = 5000;

    const hasLepara = nfts.some(n => n.type === 'Lepara');
    const hasGroot = nfts.some(n => n.type === 'Grootman');

    if (!promotedToLepara && rep >= LEPARA_THRESHOLD && !hasLepara) {
      mintLepara().then(() => {
        setPromotedToLepara(true);
        fetchNFTs();
      }).catch(e => console.warn('Lepara promotion failed', e));
    }

    if (!promotedToGrootman && rep >= GROOT_THRESHOLD && !hasGroot) {
      const to = accountAddress ?? '';
      if (!to) return;
      const metadataURI = 'ipfs://bafkreidu7vwogndcpfllabbysjhcbevdxhk4o5qpzczsjtzwhzia3fz4ri';
      mintGrootman(to as `0x${string}`, metadataURI)
        .then(() => {
          setPromotedToGrootman(true);
          fetchNFTs();
        })
        .catch(e => console.warn('Grootman mint failed', e));
    }
  }, [rep, gameState.walletConnected, promotedToLepara, promotedToGrootman, mintLepara, mintGrootman, fetchNFTs, nfts, accountAddress]);

  const handlePurchaseStock = useCallback((item: ItemType, price: number, quantity = 5) => {
    setSpzaBalance(prev => prev - price);
    setStock(prev => ({ ...prev, [item]: prev[item] + quantity }));
    playSound('kaching');
  }, [playSound]);

  const nextRound = useCallback(() => {
    setShowCustomer(false);
    setShowBubble(false);

    setTimeout(() => {
      const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      let item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      if (char.type === 'child' && String(item) === 'Cigarettes') item = 'Bread';

      setGameState(prev => ({ ...prev, currentOrder: item }));

      const phraseTemplate = PHRASES[char.type][Math.floor(Math.random() * PHRASES[char.type].length)];
      const itemHtml = `<span class="text-blue-600 font-bold text-lg">${item.toUpperCase()}</span>`;
      const finalPhrase = phraseTemplate.replace('{item}', itemHtml);

      setCurrentCustomer(char);
      setCurrentDialogue(finalPhrase);
      setShowCustomer(true);

      setTimeout(() => {
        setShowBubble(true);
        playSound('pop');
      }, 300);
    }, 400);
  }, [playSound]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        const newTimeLeft = prev.timeLeft - 0.1;
        if (newTimeLeft <= 0) {
          const newHearts = prev.hearts - 1;
          if (newHearts <= 0) {
            setGameOver(true);
            stopChirping();
            return { ...prev, playing: false, timeLeft: 0, hearts: 0 };
          } else {
            return { ...prev, timeLeft: 10, hearts: newHearts };
          }
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 100);
  }, [stopChirping]);

  const startGame = useCallback(() => {
    if (!gameState.walletConnected) return;
    setGameState(prev => ({ ...prev, playing: true, score: 0, timeLeft: 10, hearts: 5 }));
    setGameOver(false);
    playSound('start');
    startChirping();
    nextRound();
    startTimer();
  }, [gameState.walletConnected, playSound, nextRound, startTimer, startChirping]);

  const handleOutOfStock = useCallback((item: ItemType) => {
    setOutOfStockItem(item);
    setCurrentDialogue('<span class="text-red-600 font-bold text-xl">Haibo!?</span>');
    setShakeMain(true);
    setTimeout(() => {
      setShakeMain(false);
      nextRound();
    }, 1000);
  }, [nextRound]);

  const handleOrder = useCallback((item: ItemType) => {
    if (!gameState.playing) return;
    if (item === gameState.currentOrder) {
      if (!stock[item] || stock[item] <= 0) {
        handleOutOfStock(item);
        return;
      }

      setStock(prev => ({ ...prev, [item]: Math.max(0, prev[item] - 1) }));

      // reward math
      const baseEarn = ITEM_PRICE[item] ?? 1;
      const timeLeft = gameState.timeLeft ?? 0;
      const speedMultiplier = 1 + Math.max(0, (timeLeft / 10) * 0.5);
      const weatherModifier = weather.icon === 'rainy' ? 1.1 : 1.0;
      const comboBonus = 1 + Math.max(0, consecutiveServes) * 0.05;

      const spzaEarned = Math.round(baseEarn * speedMultiplier * weatherModifier * comboBonus);
      const repGain = Math.max(1, Math.round(baseEarn * 0.1 * speedMultiplier * comboBonus));

      setSpzaBalance(prev => prev + spzaEarned);
      setRep(prev => prev + repGain);
      setConsecutiveServes(prev => prev + 1);

      setGameState(prev => ({ ...prev, score: prev.score + 1, timeLeft: Math.min(10, prev.timeLeft + 2) }));
      playSound('kaching');
      nextRound();
    } else {
      setGameState(prev => {
        const newHearts = prev.hearts - 1;
        if (newHearts <= 0) {
          setGameOver(true);
          stopChirping();
          return { ...prev, playing: false, hearts: 0 };
        }
        return { ...prev, hearts: newHearts };
      });

      // penalty
      setConsecutiveServes(0);
      setRep(prev => Math.max(0, prev - 1));

      setCurrentDialogue('<span class="text-red-600 font-bold text-xl">Haibo!?</span>');
      setShakeMain(true);
      setTimeout(() => {
        setShakeMain(false);
        nextRound();
      }, 1000);
    }
  }, [gameState.playing, gameState.currentOrder, nextRound, stock, handleOutOfStock, playSound, consecutiveServes, weather.icon]);

  const handleRestart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameOver(false);
    startGame();
  }, [startGame]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopChirping();
    };
  }, [stopChirping]);

  useEffect(() => {
    if (gameOver) stopChirping();
  }, [gameOver, stopChirping]);

  // Ownership helper for Latjie prompt
  const hasLatjie = nfts.some(n => n.type === 'Latjie');

  return (
    <div className="bg-white min-h-screen flex flex-col relative font-body">
      {!gameState.walletConnected && <LoginScreen onConnect={handleWalletConnect} />}

      {/* Mint prompt shown once after login for Latjie (ERC-1155) */}
      {gameState.walletConnected && showMintPrompt && (
        <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full text-center shadow-[8px_8px_0px_0px_black]">
            <h3 className="font-heading text-2xl mb-2">Recruit Latjie</h3>
            <p className="mb-4 text-sm">Welcome hustler — recruit your Latjie character for free. This mint is gasless.</p>
            {mintError && <p className="text-red-600 mb-2 text-sm">{mintError}</p>}
            <div className="flex gap-3 justify-center">
              <button
                className="neubrutalist-btn bg-yellow-400 px-4 py-2"
                onClick={async () => {
                  if (!hasLatjie) await mintLatjie();
                  fetchNFTs();
                  setShowMintPrompt(false);
                }}
                disabled={mintPending || hasLatjie}
              >
                {mintPending ? 'Minting...' : (hasLatjie ? 'Already owned' : 'Mint Latjie')}
              </button>
              <button className="neubrutalist-btn bg-gray-200 px-4 py-2" onClick={() => setShowMintPrompt(false)} disabled={mintPending}>Skip</button>
            </div>
          </div>
        </div>
      )}

      <GlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
      <WalletScreen isOpen={walletOpen} onClose={() => setWalletOpen(false)} />
      <ShopScreen isOpen={shopOpen} onClose={() => setShopOpen(false)} spzaBalance={spzaBalance} stock={stock} onPurchase={(item, price, quantity = 5) => {
        if (spzaBalance < price) return; handlePurchaseStock(item, price, quantity);
      }} />

      {outOfStockItem && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white border-4 border-black p-6 max-w-sm w-full text-center shadow-[8px_8px_0px_0px_black]">
            <h3 className="font-heading text-2xl mb-2">Out of Stock</h3>
            <p className="mb-4 font-body text-sm">Your {outOfStockItem} is out of stock. Buy more?</p>
            <div className="flex flex-col gap-2">
              <button className="neubrutalist-btn bg-yellow-400 text-black px-4 py-2" onClick={() => { setOutOfStockItem(null); setShopOpen(true); }}>Buy more</button>
              <button className="neubrutalist-btn bg-gray-200 text-black px-4 py-2" onClick={() => setOutOfStockItem(null)}>Stock is finished</button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full max-w-7xl mx-auto w-full shadow-2xl backdrop-blur-sm border-x-4 border-black">
        <Header score={gameState.score} onOpenGlossary={() => setGlossaryOpen(true)} spzaBalance={spzaBalance} rep={rep} />

        <div className="flex flex-1">
          <Sidebar onOpenWallet={() => setWalletOpen(true)} onOpenShop={() => setShopOpen(true)} rep={rep} />
          <GameArea playing={gameState.playing} timeLeft={gameState.timeLeft} currentCustomer={currentCustomer} currentDialogue={currentDialogue} showCustomer={showCustomer} showBubble={showBubble} onStartGame={startGame} onHandleOrder={handleOrder} score={gameState.score} gameOver={gameOver} onRestart={handleRestart} shakeMain={shakeMain} hearts={gameState.hearts} stock={stock} />
        </div>
      </div>
    </div>
  );
};

export default App;