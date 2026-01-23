import React, { useState, useCallback, useRef } from 'react';
import LoginScreen from './components/LoginScreen';
import GlossaryModal from './components/GlossaryModal';
import WalletScreen from './components/WalletScreen';
import ShopScreen from './components/ShopScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GameArea from './components/GameArea';
import { GameState, Character, ItemType } from './types';
import { CHARACTERS, ITEMS, PHRASES } from './data/gameData';
import { useSound } from './hooks/useSound';

const INITIAL_STOCK: Record<ItemType, number> = {
  Bread: 15,
  Coke: 8,
  Milk: 12,
  Eggs: 6,
  Goslos: 4,
  Benny: 3
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
  const [spzaBalance, setSpzaBalance] = useState(1240);
  const [shakeMain, setShakeMain] = useState(false);
  const [stock, setStock] = useState<Record<ItemType, number>>(INITIAL_STOCK);
  const [outOfStockItem, setOutOfStockItem] = useState<ItemType | null>(null);

  const { playSound } = useSound();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chirpRef = useRef<HTMLAudioElement | null>(null);

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
  }, []);

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
      
      if (char.type === 'child' && item === 'Cigarettes') item = 'Bread';

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
            // Reset timer and continue with fewer hearts
            return { ...prev, timeLeft: 10, hearts: newHearts };
          }
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 100);
  }, [playSound, stopChirping]);

  const startGame = useCallback(() => {
    if (!gameState.walletConnected) return;
    
    setGameState(prev => ({
      ...prev,
      playing: true,
      score: 0,
      timeLeft: 10,
      hearts: 5
    }));
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
      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        timeLeft: Math.min(10, prev.timeLeft + 2)
      }));
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
      
      // Show "Haibo!?" feedback
      setCurrentDialogue('<span class="text-red-600 font-bold text-xl">Haibo!?</span>');
      setShakeMain(true);
      
      setTimeout(() => {
        setShakeMain(false);
        nextRound(); // Move to next customer after feedback
      }, 1000);
    }
  }, [gameState.playing, gameState.currentOrder, playSound, nextRound, stock, handleOutOfStock]);

  const handleRestart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameOver(false);
    startGame();
  }, [startGame]);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopChirping();
    };
  }, [stopChirping]);

  React.useEffect(() => {
    if (gameOver) {
      stopChirping();
    }
  }, [gameOver, stopChirping]);

  return (
    <div className="bg-white min-h-screen flex flex-col relative font-body">
      {!gameState.walletConnected && <LoginScreen onConnect={handleWalletConnect} />}
      
      <GlossaryModal 
        isOpen={glossaryOpen} 
        onClose={() => setGlossaryOpen(false)} 
      />
      
      <WalletScreen 
        isOpen={walletOpen} 
        onClose={() => setWalletOpen(false)} 
      />
      
      <ShopScreen 
        isOpen={shopOpen} 
        onClose={() => setShopOpen(false)}
        spzaBalance={spzaBalance}
        stock={stock}
        onPurchase={(item, price, quantity = 5) => {
          if (spzaBalance < price) return;
          handlePurchaseStock(item, price, quantity);
        }}
      />

      {outOfStockItem && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white border-4 border-black p-6 max-w-sm w-full text-center shadow-[8px_8px_0px_0px_black]">
            <h3 className="font-heading text-2xl mb-2">Out of Stock</h3>
            <p className="mb-4 font-body text-sm">Your {outOfStockItem} is out of stock. Buy more?</p>
            <div className="flex flex-col gap-2">
              <button 
                className="neubrutalist-btn bg-yellow-400 text-black px-4 py-2"
                onClick={() => {
                  setOutOfStockItem(null);
                  setShopOpen(true);
                }}
              >
                Buy more
              </button>
              <button 
                className="neubrutalist-btn bg-gray-200 text-black px-4 py-2"
                onClick={() => setOutOfStockItem(null)}
              >
                Stock is finished
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full max-w-7xl mx-auto w-full shadow-2xl backdrop-blur-sm border-x-4 border-black">
        <Header 
          score={gameState.score}
          onOpenGlossary={() => setGlossaryOpen(true)}
          spzaBalance={spzaBalance}
        />
        
        <div className="flex flex-1">
          <Sidebar 
            onOpenWallet={() => setWalletOpen(true)} 
            onOpenShop={() => setShopOpen(true)}
          />
          <GameArea
            playing={gameState.playing}
            timeLeft={gameState.timeLeft}
            currentCustomer={currentCustomer}
            currentDialogue={currentDialogue}
            showCustomer={showCustomer}
            showBubble={showBubble}
            onStartGame={startGame}
            onHandleOrder={handleOrder}
            score={gameState.score}
            gameOver={gameOver}
            onRestart={handleRestart}
            shakeMain={shakeMain}
            hearts={gameState.hearts}
            stock={stock}
          />
        </div>
      </div>
    </div>
  );
};

export default App;