
import React from 'react';
import { UserStats, View } from '../types';

interface NavbarProps {
  stats: UserStats;
  setView: (v: View) => void;
  activeView: View;
  isSyncing: boolean;
  onSync: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ stats, setView, activeView, isSyncing, onSync }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#1f2833] h-16 border-b-4 border-black z-50 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('home')}>
        <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center pixel-border text-2xl">
          {stats.activeCharacter}
        </div>
        <div className="flex flex-col">
          <span className="pixel-font text-[8px] text-white">STUDY QUEST</span>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-blue-400 animate-ping' : 'bg-green-500'}`} onClick={onSync}></div>
            <span className="retro-font text-[10px] text-gray-400 uppercase">{isSyncing ? 'Syncing...' : 'Cloud Active'}</span>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-6">
        <NavButton active={activeView === 'tasks'} onClick={() => setView('tasks')}>Quests</NavButton>
        <NavButton active={activeView === 'party'} onClick={() => setView('party')}>Guild</NavButton>
        <NavButton active={activeView === 'timer'} onClick={() => setView('timer')}>Timer</NavButton>
        <NavButton active={activeView === 'ai'} onClick={() => setView('ai')}>AI Sage</NavButton>
        <NavButton active={activeView === 'shop'} onClick={() => setView('shop')}>Skins</NavButton>
        <NavButton active={activeView === 'leaderboard'} onClick={() => setView('leaderboard')}>Ranks</NavButton>
        <NavButton active={activeView === 'stats'} onClick={() => setView('stats')}>Log</NavButton>
      </div>

      <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs pixel-font">
        <div className="hidden sm:flex flex-col items-end gap-1 mr-2">
          <div className="flex items-center gap-1">
            <span className="text-purple-400 text-[8px]">MP</span>
            <div className="w-16 h-2 bg-gray-900 border border-black overflow-hidden">
              <div className="h-full bg-purple-500 transition-all" style={{ width: `${stats.mana}%` }}></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">🪙</span>
          <span className="text-yellow-400">{stats.gold}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-blue-400 text-[8px] md:text-[10px]">LVL {stats.level}</span>
          <div className="w-8 md:w-12 h-1.5 md:h-2 bg-gray-700 pixel-border border-2 relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(stats.xp % 1000) / 10}%` }}
            ></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button 
    onClick={onClick}
    className={`pixel-font text-[8px] uppercase transition-colors ${active ? 'text-yellow-400 underline underline-offset-4' : 'text-white hover:text-yellow-200'}`}
  >
    {children}
  </button>
);
