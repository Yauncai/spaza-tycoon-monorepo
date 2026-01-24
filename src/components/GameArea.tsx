import React from 'react';
import { Character, ItemType } from '../types';
import { useWeather } from '../hooks/useWeather';

interface GameAreaProps {
  playing: boolean;
  timeLeft: number;
  currentCustomer: Character | null;
  currentDialogue: string;
  showCustomer: boolean;
  showBubble: boolean;
  onStartGame: () => void;
  onHandleOrder: (item: ItemType) => void;
  score: number;
  gameOver: boolean;
  onRestart: () => void;
  shakeMain: boolean;
  hearts: number;
  stock: Record<ItemType, number>;
}

const GameArea: React.FC<GameAreaProps> = ({
  playing,
  timeLeft,
  currentCustomer,
  currentDialogue,
  showCustomer,
  showBubble,
  onStartGame,
  onHandleOrder,
  score,
  gameOver,
  onRestart,
  shakeMain,
  hearts,
  stock
}) => {
  const weather = useWeather();

  return (
    <main className={`flex-1 flex flex-col relative transition-transform duration-100 ${shakeMain ? 'translate-x-2' : ''}`} style={{backgroundImage: 'url(/assets/sunny_day.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      {/* Hearts */}
      <div className="absolute top-4 left-4 z-20 flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <span 
            key={i} 
            className={`material-symbols-outlined text-2xl ${
              i < hearts ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            favorite
          </span>
        ))}
      </div>

      {/* Weather Tag */}
      <div className="absolute top-4 right-4 z-20 bg-white border-2 border-black px-2 py-1 flex items-center gap-2 shadow-md">
        <span className={`material-symbols-outlined ${weather.icon === 'rainy' ? 'text-blue-500' : 'text-yellow-500'}`}>
          {weather.icon}
        </span>
        <span className="text-xs font-bold uppercase">{weather.text}</span>
      </div>

      {/* Play Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-4 mt-8 z-10">
        {/* Timer */}
        {playing && (
          <div className="w-full max-w-md h-6 bg-black border-2 border-black mb-4 relative rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-100 ease-linear ${(timeLeft / 10) * 100 < 30 ? 'bg-red-500' : 'bg-yellow-400'}`}
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          </div>
        )}

        {/* Customer Scene */}
        <div className="relative w-full max-w-lg h-80 flex items-center justify-center mb-8">
          {/* Customer */}
          <div className={`w-72 h-72 relative transition-transform duration-500 ${showCustomer ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            {currentCustomer && (
              <img 
                alt="Customer" 
                className="w-full h-full object-contain drop-shadow-xl" 
                src={currentCustomer.src}
              />
            )}
          </div>

          {/* Speech Bubble */}
          {showBubble && (
            <div className="absolute top-0 -right-4 md:-right-20 bg-white border-4 border-black p-4 rounded-xl shadow-[8px_8px_0px_0px_black] z-30 animate-float max-w-[200px]">
              <p 
                className="font-heading text-sm text-center leading-tight"
                dangerouslySetInnerHTML={{ __html: currentDialogue }}
              />
              <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-black border-b-[10px] border-b-transparent"></div>
              <div className="absolute top-1/2 -left-[11px] -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[12px] border-r-white border-b-[6px] border-b-transparent"></div>
            </div>
          )}

          {/* Start Screen */}
          {!playing && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-40">
              <h2 className="font-heading text-4xl mb-2">SPAZA RUSH</h2>
              <button 
                className="neubrutalist-btn bg-yellow-400 text-black px-8 py-4 text-xl flex items-center gap-2"
                onClick={onStartGame}
              >
                <span className="material-symbols-outlined">play_circle</span> Start
              </button>
            </div>
          )}

          {/* Game Over */}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-50 text-white p-8 text-center">
              <h2 className="font-heading text-4xl mb-2 text-yellow-400">SHARP SHARP!</h2>
              <div className="text-6xl font-heading mb-6">{score}</div>
              <p className="mb-6 text-gray-400">Customers Served</p>
              <button 
                className="neubrutalist-btn bg-blue-500 text-white border-white px-6 py-3"
                onClick={onRestart}
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full max-w-3xl bg-black/5 p-4 rounded-xl border-t-4 border-black/10 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-4">
            <button 
              className="item-card relative bg-white border-4 border-black rounded-xl p-2 h-40 flex flex-col items-center justify-between hover:scale-105 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_black] transition-transform duration-200"
              onClick={() => onHandleOrder('Bread')}
            >
              <span className={`absolute top-2 right-2 text-xs font-heading px-2 py-1 border-2 border-black rounded-full ${stock.Bread > 0 ? 'bg-yellow-300' : 'bg-red-500 text-white'}`}>
                {stock.Bread ?? 0}
              </span>
              <img 
                className="w-24 h-24 object-contain" 
                src="/assets/bread.png"
                alt="Bread"
              />
              <span className="font-heading text-lg">BREAD</span>
            </button>
            <button 
              className="item-card relative bg-white border-4 border-black rounded-xl p-2 h-40 flex flex-col items-center justify-between hover:scale-105 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_black] transition-transform duration-200"
              onClick={() => onHandleOrder('Coke')}
            >
              <span className={`absolute top-2 right-2 text-xs font-heading px-2 py-1 border-2 border-black rounded-full ${stock.Coke > 0 ? 'bg-yellow-300' : 'bg-red-500 text-white'}`}>
                {stock.Coke ?? 0}
              </span>
              <img 
                className="w-24 h-24 object-contain" 
                src="/assets/coke.png"
                alt="Coke"
              />
              <span className="font-heading text-lg">COKE</span>
            </button>
            <button 
              className="item-card relative bg-white border-4 border-black rounded-xl p-2 h-40 flex flex-col items-center justify-between hover:scale-105 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_black] transition-transform duration-200"
              onClick={() => onHandleOrder('Milk')}
            >
              <span className={`absolute top-2 right-2 text-xs font-heading px-2 py-1 border-2 border-black rounded-full ${stock.Milk > 0 ? 'bg-yellow-300' : 'bg-red-500 text-white'}`}>
                {stock.Milk ?? 0}
              </span>
              <img 
                className="w-16 h-16 object-contain" 
                src="/assets/milk.png"
                alt="Milk"
              />
              <span className="font-heading text-lg">MILK</span>
            </button>
            <button 
              className="item-card relative bg-white border-4 border-black rounded-xl p-2 h-40 flex flex-col items-center justify-between hover:scale-105 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_black] transition-transform duration-200"
              onClick={() => onHandleOrder('Eggs')}
            >
              <span className={`absolute top-2 right-2 text-xs font-heading px-2 py-1 border-2 border-black rounded-full ${stock.Eggs > 0 ? 'bg-yellow-300' : 'bg-red-500 text-white'}`}>
                {stock.Eggs ?? 0}
              </span>
              <img 
                className="w-24 h-24 object-contain" 
                src="/assets/eggs.png"
                alt="Eggs"
              />
              <span className="font-heading text-lg">Eggs</span>
            </button>
            <button 
              className="item-card relative bg-white border-4 border-black rounded-xl p-2 h-40 flex flex-col items-center justify-between hover:scale-105 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_black] transition-transform duration-200"
              onClick={() => onHandleOrder('Goslos')}
            >
              <span className={`absolute top-2 right-2 text-xs font-heading px-2 py-1 border-2 border-black rounded-full ${stock.Goslos > 0 ? 'bg-yellow-300' : 'bg-red-500 text-white'}`}>
                {stock.Goslos ?? 0}
              </span>
              <img 
                className="w-24 h-24 object-contain" 
                src="/assets/goslos.png"
                alt="Goslos"
              />
              <span className="font-heading text-lg">Goslos</span>
            </button>
            <button 
              className="item-card relative bg-white border-4 border-black rounded-xl p-2 h-40 flex flex-col items-center justify-between hover:scale-105 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_black] transition-transform duration-200"
              onClick={() => onHandleOrder('Benny')}
            >
              <span className={`absolute top-2 right-2 text-xs font-heading px-2 py-1 border-2 border-black rounded-full ${stock.Benny > 0 ? 'bg-yellow-300' : 'bg-red-500 text-white'}`}>
                {stock.Benny ?? 0}
              </span>
              <img 
                className="w-24 h-24 object-contain" 
                src="/assets/benny.jfif"
                alt="Benny"
              />
              <span className="font-heading text-lg">Benny</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GameArea;