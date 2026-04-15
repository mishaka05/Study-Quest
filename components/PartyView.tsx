
import React, { useState } from 'react';
import { Party, PartyMember } from '../types';
import { validateString, sanitizeText, RATE_LIMITS } from '../utils/security';

interface PartyViewProps {
  party: Party | null;
  setParty: (p: Party | null) => void;
}

export const PartyView: React.FC<PartyViewProps> = ({ party, setParty }) => {
  const [guildName, setGuildName] = useState('');
  const [inviteInput, setInviteInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGuild = () => {
    const validation = validateString(guildName, { 
      min: 3, 
      max: RATE_LIMITS.MAX_GUILD_NAME_LENGTH 
    });
    
    if (!validation.valid) {
      setError(validation.error || "Invalid name");
      return;
    }

    const sanitized = sanitizeText(guildName.trim());
    const newParty: Party = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      name: sanitized,
      guildLevel: 1,
      guildXp: 0,
      members: [
        { id: 'user-main', name: 'You (Hero)', level: 10, status: 'online', avatar: '🧙‍♂️', xpTotal: 10000 },
        { id: 'npc-1', name: 'Aria the Wise', level: 8, status: 'studying', avatar: '🧝‍♀️', xpTotal: 8000 },
        { id: 'npc-2', name: 'Korg the Tank', level: 12, status: 'offline', avatar: '🛡️', xpTotal: 12000 }
      ]
    };
    setParty(newParty);
    setError(null);
  };

  const joinGuild = () => {
    const validation = validateString(inviteInput, { 
      min: 6, 
      max: 6, 
      pattern: /^[A-Z0-9]+$/ 
    });

    if (!validation.valid) {
      setError("Invalid Guild Code (must be 6 uppercase chars/numbers)");
      return;
    }

    const joinedParty: Party = {
      id: inviteInput.toUpperCase(),
      name: "The Phoenix Order",
      guildLevel: 5,
      guildXp: 450,
      members: [
        { id: 'user-recruit', name: 'You (Recruit)', level: 1, status: 'online', avatar: '⚔️', xpTotal: 100 },
        { id: 'peer1', name: 'Scholar Beth', level: 15, status: 'studying', avatar: '📖', xpTotal: 15000 },
        { id: 'peer2', name: 'Master Lin', level: 22, status: 'online', avatar: '🧘', xpTotal: 22000 }
      ]
    };
    setParty(joinedParty);
    setInviteInput('');
    setError(null);
  };

  const copyCode = () => {
    if (party) {
      navigator.clipboard.writeText(party.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const leaveGuild = () => {
    if (confirm("Are you sure you want to abandon your guild? All team progress will be lost.")) {
      setParty(null);
    }
  };

  if (!party) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8 text-center">
        <div className="text-8xl mb-4">🛡️</div>
        <h2 className="pixel-font text-2xl text-yellow-400 uppercase">Join the Adventure</h2>
        <p className="retro-font text-xl text-gray-400">Collaborate with peers to double your study power.</p>
        
        {error && <p className="pixel-font text-[10px] text-red-500 bg-red-900/20 p-2 pixel-border">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1f2833] pixel-border p-6 space-y-4">
             <h3 className="pixel-font text-[10px] text-blue-400">FOUND A GUILD</h3>
             <input 
              type="text"
              value={guildName}
              onChange={(e) => {
                setGuildName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Guild Name..."
              className="w-full bg-[#0b0c10] border-4 border-black p-3 pixel-font text-[10px] text-white focus:outline-none focus:border-yellow-400"
              maxLength={RATE_LIMITS.MAX_GUILD_NAME_LENGTH}
            />
            <button onClick={createGuild} className="pixel-button w-full bg-yellow-400 text-[10px]">
              CREATE
            </button>
          </div>

          <div className="bg-[#1f2833] pixel-border p-6 space-y-4">
             <h3 className="pixel-font text-[10px] text-green-400">USE INVITE CODE</h3>
             <input 
              type="text"
              value={inviteInput}
              onChange={(e) => {
                setInviteInput(e.target.value.toUpperCase());
                if (error) setError(null);
              }}
              placeholder="CODE..."
              className="w-full bg-[#0b0c10] border-4 border-black p-3 pixel-font text-[10px] text-white focus:outline-none focus:border-green-400"
              maxLength={6}
            />
            <button onClick={joinGuild} className="pixel-button w-full bg-green-500 text-[10px]">
              JOIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-yellow-400 pb-4 gap-4">
        <div>
          <h2 className="pixel-font text-2xl text-white">{party.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="pixel-font text-[10px] text-yellow-400">INVITE CODE: {party.id}</span>
            <button 
              onClick={copyCode}
              className={`text-[8px] pixel-font px-2 py-1 pixel-border ${copied ? 'bg-green-600' : 'bg-gray-700'}`}
            >
              {copied ? 'COPIED!' : 'COPY'}
            </button>
          </div>
        </div>
        <div className="text-right w-full md:w-auto">
          <p className="pixel-font text-xs text-blue-400 uppercase">Guild Level {party.guildLevel}</p>
          <div className="w-full md:w-48 h-4 bg-gray-700 pixel-border relative overflow-hidden mt-1">
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(party.guildXp % 1000) / 10}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="pixel-font text-sm text-gray-400 uppercase">Active Party</h3>
          <div className="space-y-3">
            {party.members.map(member => (
              <div key={member.id} className="bg-[#1f2833] pixel-border p-4 flex items-center gap-4 hover:bg-[#252e39] transition-colors">
                <div className="text-3xl w-12 h-12 flex items-center justify-center bg-[#0b0c10] pixel-border">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <p className="pixel-font text-xs text-white">{member.name}</p>
                  <p className="retro-font text-sm text-blue-400">Level {member.level}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] pixel-font ${member.status === 'online' ? 'text-green-500' : member.status === 'studying' ? 'text-yellow-400 animate-pulse' : 'text-gray-600'}`}>
                    {member.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={leaveGuild} className="w-full text-red-500 pixel-font text-[10px] mt-4 hover:underline">
            ABANDON GUILD
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="pixel-font text-sm text-gray-400 uppercase">Guild Perks</h3>
          <div className="bg-[#1f2833] pixel-border p-6 space-y-4">
            <Perk active={true} title="United Front" desc="20% XP bonus for shared study sessions." />
            <Perk active={party.guildLevel >= 5} title="Bounty Board" desc="Access to high-reward Party Quests." />
            <Perk active={party.guildLevel >= 10} title="Sage's Blessing" desc="2x gold from AI-suggested tasks." />
          </div>

          <div className="bg-blue-900/20 p-4 pixel-border border-blue-500/50">
             <p className="pixel-font text-[8px] text-blue-300 leading-relaxed">
               TIP: Share your Invite Code with friends. When they study, the Guild earns XP and you unlock more perks!
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Perk: React.FC<{ active: boolean; title: string; desc: string }> = ({ active, title, desc }) => (
  <div className={`${active ? 'opacity-100' : 'opacity-30'} border-l-4 border-yellow-400 pl-4`}>
    <p className="pixel-font text-xs text-white">{title}</p>
    <p className="retro-font text-sm text-gray-400">{desc}</p>
  </div>
);
