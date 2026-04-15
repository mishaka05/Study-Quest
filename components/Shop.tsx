
import React from 'react';
import { UserStats, Skin } from '../types';

interface ShopProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  onPurchase: (skin: Skin) => boolean;
}

const ALL_SKINS: Skin[] = [
  { id: 'char-knight', name: 'Elite Knight', type: 'character', cost: 1500, icon: '🛡️' },
  { id: 'char-mage', name: 'Archmage', type: 'character', cost: 2500, icon: '🧙' },
  { id: 'char-ninja', name: 'Shinobi', type: 'character', cost: 3000, icon: '🥷' },
  { id: 'bg-dungeon', name: 'Deep Dungeon', type: 'background', cost: 1000, icon: '🏰', styleClass: 'bg-[#1a1a1a]' },
  { id: 'bg-forest', name: 'Mystic Woods', type: 'background', cost: 2000, icon: '🌳', styleClass: 'bg-[#0f2d1a]' },
  { id: 'bg-cosmos', name: 'Deep Space', type: 'background', cost: 5000, icon: '🌌', styleClass: 'bg-[#050510]' },
];

export const Shop: React.FC<ShopProps> = ({ stats, setStats, onPurchase }) => {
  const selectSkin = (skin: Skin) => {
    if (skin.type === 'character') {
      setStats(prev => ({ ...prev, activeCharacter: skin.icon }));
    } else {
      setStats(prev => ({ ...prev, activeBackground: skin.styleClass || 'bg-[#0b0c10]' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-32">
      <div className="text-center">
        <h2 className="pixel-font text-2xl text-yellow-400">VANITY VAULT</h2>
        <p className="retro-font text-xl text-gray-400">Exchange your hard-earned XP for legendary skins.</p>
        <div className="mt-4 inline-block bg-blue-900/40 p-2 pixel-border">
          <span className="pixel-font text-xs text-blue-300">TOTAL XP: {stats.xp}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h3 className="pixel-font text-sm text-white uppercase border-b border-gray-800 pb-2">Character Skins</h3>
          <div className="space-y-4">
            {ALL_SKINS.filter(s => s.type === 'character').map(skin => (
              <SkinCard 
                key={skin.id} 
                skin={skin} 
                isUnlocked={stats.unlockedSkins.includes(skin.id)}
                isActive={stats.activeCharacter === skin.icon}
                onBuy={() => onPurchase(skin)}
                onSelect={() => selectSkin(skin)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="pixel-font text-sm text-white uppercase border-b border-gray-800 pb-2">Environment Themes</h3>
          <div className="space-y-4">
            {ALL_SKINS.filter(s => s.type === 'background').map(skin => (
              <SkinCard 
                key={skin.id} 
                skin={skin} 
                isUnlocked={stats.unlockedSkins.includes(skin.id)}
                isActive={stats.activeBackground === skin.styleClass}
                onBuy={() => onPurchase(skin)}
                onSelect={() => selectSkin(skin)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const SkinCard: React.FC<{ skin: Skin; isUnlocked: boolean; isActive: boolean; onBuy: () => void; onSelect: () => void }> = ({ skin, isUnlocked, isActive, onBuy, onSelect }) => (
  <div className={`bg-[#1f2833] pixel-border p-4 flex items-center justify-between transition-all ${isActive ? 'border-yellow-400 bg-[#252e39]' : ''}`}>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-black flex items-center justify-center text-3xl pixel-border">
        {skin.icon}
      </div>
      <div>
        <p className="pixel-font text-[10px] text-white">{skin.name}</p>
        {!isUnlocked && <p className="retro-font text-sm text-yellow-400">{skin.cost} XP</p>}
        {isUnlocked && <p className="retro-font text-sm text-green-500 uppercase">Unlocked</p>}
      </div>
    </div>
    
    {isUnlocked ? (
      <button 
        onClick={onSelect}
        disabled={isActive}
        className={`pixel-font text-[8px] px-3 py-2 ${isActive ? 'bg-gray-700 text-gray-500' : 'bg-blue-600 hover:bg-blue-500'}`}
      >
        {isActive ? 'ACTIVE' : 'EQUIP'}
      </button>
    ) : (
      <button 
        onClick={onBuy}
        className="pixel-button bg-yellow-400 text-[8px] py-2"
      >
        BUY
      </button>
    )}
  </div>
);
