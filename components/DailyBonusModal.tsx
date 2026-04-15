
import React from 'react';

interface DailyBonusModalProps {
  onClaim: () => void;
}

export const DailyBonusModal: React.FC<DailyBonusModalProps> = ({ onClaim }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="max-w-sm w-full bg-[#1f2833] pixel-border p-8 text-center animate-bounce-in">
        <div className="text-6xl mb-4 animate-bounce">🎁</div>
        <h2 className="pixel-font text-xl text-yellow-400 mb-2">DAILY LOG</h2>
        <h3 className="pixel-font text-sm text-white mb-6 uppercase">Reward Unlocked!</h3>
        
        <div className="bg-[#0b0c10] pixel-border p-4 mb-8 space-y-3">
          <div className="flex justify-between items-center">
            <span className="pixel-font text-[10px] text-blue-400">XP GAINED</span>
            <span className="pixel-font text-xs text-white">+200</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="pixel-font text-[10px] text-yellow-400">GOLD EARNT</span>
            <span className="pixel-font text-xs text-white">+100</span>
          </div>
        </div>

        <button 
          onClick={onClaim}
          className="pixel-button w-full bg-green-500 text-sm"
        >
          CLAIM BOUNTY
        </button>
      </div>
    </div>
  );
};
