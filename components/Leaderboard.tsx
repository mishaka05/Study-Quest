
import React from 'react';
import { UserStats } from '../types';

interface LeaderboardProps {
  userStats: UserStats;
}

const MOCK_LEADERS = [
  { name: 'Xenon_Sage', level: 84, xp: 84200, avatar: '🧙‍♂️', current: false },
  { name: 'StudyMage_99', level: 72, xp: 72500, avatar: '🧙‍♀️', current: false },
  { name: 'FocusKnight', level: 68, xp: 68100, avatar: '🛡️', current: false },
  { name: 'CodexMaster', level: 55, xp: 55000, avatar: '📜', current: false },
  { name: 'Scholar_01', level: 42, xp: 42300, avatar: '📖', current: false },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ userStats }) => {
  const currentRank = { name: 'You', level: userStats.level, xp: userStats.xp, avatar: userStats.activeCharacter, current: true };
  const sorted = [...MOCK_LEADERS, currentRank].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center">
        <h2 className="pixel-font text-2xl text-blue-400">HALL OF HEROES</h2>
        <p className="retro-font text-xl text-gray-400">The most dedicated scholars in the realm.</p>
      </div>

      <div className="bg-[#1f2833] pixel-border p-4">
        <div className="flex px-4 py-2 border-b-4 border-black mb-4 pixel-font text-[10px] text-gray-500 uppercase">
          <span className="w-12">Rank</span>
          <span className="flex-1">Adventurer</span>
          <span className="w-24 text-right">Lvl</span>
          <span className="w-24 text-right">XP</span>
        </div>
        
        <div className="space-y-2">
          {sorted.map((hero, index) => (
            <div 
              key={index} 
              className={`flex items-center px-4 py-3 pixel-border ${hero.current ? 'bg-yellow-400/10 border-yellow-400' : 'bg-[#0b0c10] border-black'}`}
            >
              <span className={`w-12 pixel-font text-xs ${index < 3 ? 'text-yellow-400' : 'text-gray-500'}`}>
                #{index + 1}
              </span>
              <div className="flex-1 flex items-center gap-3">
                <span className="text-2xl">{hero.avatar}</span>
                <span className={`pixel-font text-[10px] ${hero.current ? 'text-yellow-400' : 'text-white'}`}>
                  {hero.name} {hero.current && '(YOU)'}
                </span>
              </div>
              <span className="w-24 text-right pixel-font text-[10px] text-blue-400">{hero.level}</span>
              <span className="w-24 text-right pixel-font text-[10px] text-gray-400">{hero.xp}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center p-6 bg-blue-900/10 pixel-border border-dashed border-blue-500">
        <p className="retro-font text-lg text-blue-300 uppercase">Studying with your guild grants +20% bonus XP towards global rankings!</p>
      </div>
    </div>
  );
};
