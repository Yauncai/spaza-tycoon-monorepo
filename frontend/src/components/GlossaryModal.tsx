import React from 'react';
import { GLOSSARY } from '../data/gameData';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[55] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black w-full max-w-sm shadow-[8px_8px_0px_0px_black]">
        <div className="bg-yellow-400 p-4 border-b-4 border-black flex justify-between items-center">
          <h2 className="font-heading text-xl">Kasi Glossary</h2>
          <button 
            className="bg-black text-white p-1 hover:bg-zinc-700"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {GLOSSARY.map((item, index) => (
            <div key={index} className="mb-4 border-b border-gray-200 pb-2 last:border-0">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg text-blue-600">{item.word}</span>
                <span className="text-sm font-bold text-gray-800">{item.meaning}</span>
              </div>
              <p className="text-xs text-gray-500 italic mt-1">{item.context}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlossaryModal;