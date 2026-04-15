
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  xp: number;
  isPartyQuest?: boolean;
}

export interface PartyMember {
  id: string;
  name: string;
  level: number;
  status: 'online' | 'studying' | 'offline';
  avatar: string;
  xpTotal: number;
}

export interface Party {
  name: string;
  id: string;
  members: PartyMember[];
  guildXp: number;
  guildLevel: number;
}

export interface Skin {
  id: string;
  name: string;
  type: 'character' | 'background';
  cost: number;
  icon: string;
  styleClass?: string;
}

export interface UserStats {
  level: number;
  xp: number;
  totalMinutes: number;
  gold: number;
  mana: number; // For AI usage
  lastLogin?: string;
  timerSettings: {
    work: number;
    break: number;
  };
  activeCharacter: string;
  activeBackground: string;
  unlockedSkins: string[]; // IDs of skins
}

export type View = 'home' | 'tasks' | 'timer' | 'stats' | 'ai' | 'party' | 'shop' | 'leaderboard';
