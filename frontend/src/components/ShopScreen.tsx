import React, { useState } from 'react';
import { ItemType } from '../types';
import MintLatjie from './MintLatjie';

interface ShopScreenProps {
  isOpen: boolean;
  onClose: () => void;
  spzaBalance: number;
  stock: Record<ItemType, number>;
  onPurchase: (item: ItemType, price: number, quantity?: number) => void;
}

interface StockItem {
  name: ItemType;
  image: string;
  count: number;
  price: number;
}

const SHOP_ITEMS: StockItem[] = [
  { name: 'Bread', image: '/assets/bread.png', count: 15, price: 10 },
  { name: 'Coke', image: '/assets/coke.png', count: 8, price: 15 },
  { name: 'Milk', image: '/assets/milk.png', count: 12, price: 12 },
  { name: 'Eggs', image: '/assets/eggs.png', count: 6, price: 20 },
  { name: 'Goslos', image: '/assets/goslos.png', count: 4, price: 25 },
  { name: 'Benny', image: '/assets/benny.jfif', count: 3, price: 30 }
];

const ShopScreen: React.FC<ShopScreenProps> = ({ isOpen, onClose, spzaBalance, stock, onPurchase }) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleBuyStock = (itemName: ItemType, price: number) => {
    if (spzaBalance >= price) {
      onPurchase(itemName, price, 5);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[70] bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-yellow-400 border-b-4 border-black p-6 flex justify-between items-center">
        <div>
          <h1 className="font-heading text-4xl text-black">SHOP</h1>
          <p className="text-black font-bold text-lg">View your stock or Buy more stock</p>
        </div>
        <button 
          className="neubrutalist-btn bg-black text-white p-3 hover:bg-gray-800"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Balance Display */}
      <div className="bg-green-100 border-b-4 border-black p-4">
        <div className="flex items-center justify-center gap-2">
          <span className="font-heading text-2xl text-green-800">$SPZA Balance:</span>
          <span className="font-heading text-3xl text-black">{spzaBalance}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6" style={{backgroundImage: 'url(/assets/sunny_day.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="max-w-6xl mx-auto">
          {feedback && (
            <div className="mb-6">
              <div className="bg-green-200 border-4 border-black px-4 py-3 font-heading text-lg text-black shadow-[6px_6px_0px_0px_black] text-center">
                {feedback}
              </div>
            </div>
          )}
          
          {/* Recruit Staff Section */}
          <div className="mb-8">
            <h2 className="font-heading text-3xl text-black mb-6 bg-yellow-300 p-4 border-4 border-black text-center shadow-[6px_6px_0px_0px_black]">RECRUIT STAFF</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/90 backdrop-blur-sm border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_black] flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-yellow-200 border-4 border-black rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/Young_man.png"
                    alt="Latjie character"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div>
                    <h3 className="font-heading text-2xl text-black">Latjie</h3>
                    <p className="text-sm text-gray-700">Bring on your first hustler with a fully sponsored mint on Base Sepolia.</p>
                  </div>
                  <MintLatjie onSuccess={() => setFeedback('MOOI! WELCOME!')} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Current Stock Section */}
          <div className="mb-8">
            <h2 className="font-heading text-3xl text-white mb-6 bg-black/80 p-4 border-4 border-yellow-400 text-center">YOUR STOCK</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SHOP_ITEMS.map((item, index) => {
                const count = stock[item.name] ?? item.count;
                return (
                  <div key={index} className="bg-white/90 backdrop-blur-sm border-4 border-black rounded-xl p-4 shadow-[8px_8px_0px_0px_black]">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-contain mx-auto mb-3"
                    />
                    <h3 className="font-heading text-xl text-center mb-2">{item.name}</h3>
                    <div className="text-center">
                      <span className="bg-yellow-400 border-2 border-black px-3 py-1 font-bold text-lg">
                        {count} units
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buy More Stock Section */}
          <div>
            <h2 className="font-heading text-3xl text-white mb-6 bg-black/80 p-4 border-4 border-yellow-400 text-center">BUY MORE STOCK</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SHOP_ITEMS.map((item, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm border-4 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_black]">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-contain"
                    />
                    <div className="flex-1">
                      <h3 className="font-heading text-xl mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">+5 units</p>
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-lg text-green-600">{item.price} $SPZA</span>
                        <button 
                          className={`neubrutalist-btn px-4 py-2 text-sm ${
                            spzaBalance >= item.price 
                              ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          onClick={() => handleBuyStock(item.name, item.price)}
                          disabled={spzaBalance < item.price}
                        >
                          {spzaBalance >= item.price ? 'BUY' : 'NO FUNDS'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopScreen;