
import React, { useState, useEffect, useCallback } from 'react';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { TodoList } from './components/TodoList';
import { Pomodoro } from './components/Pomodoro';
import { Statistics } from './components/Statistics';
import { AISuggestions } from './components/AISuggestions';
import { PartyView } from './components/PartyView';
import { DailyBonusModal } from './components/DailyBonusModal';
import { Shop } from './components/Shop';
import { Leaderboard } from './components/Leaderboard';
import { Task, UserStats, View, Party } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [showBonus, setShowBonus] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [deepFocus, setDeepFocus] = useState(false);

  const validateStats = (data: any): UserStats => {
    const defaults: UserStats = {
      level: 1,
      xp: 0,
      totalMinutes: 0,
      gold: 50,
      mana: 100,
      timerSettings: { work: 25, break: 5 },
      activeCharacter: '🧙‍♂️',
      activeBackground: 'bg-[#0b0c10]',
      unlockedSkins: ['base-char', 'base-bg']
    };
    if (!data) return defaults;
    return {
      ...defaults,
      ...data,
      timerSettings: { ...defaults.timerSettings, ...(data.timerSettings || {}) },
      unlockedSkins: data.unlockedSkins || defaults.unlockedSkins
    };
  };

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('quest_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('quest_stats');
    return validateStats(saved ? JSON.parse(saved) : null);
  });

  const [party, setParty] = useState<Party | null>(() => {
    const saved = localStorage.getItem('quest_party');
    return saved ? JSON.parse(saved) : null;
  });

  // Simulated Cloud Sync
  const syncWithCloud = useCallback(async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1000));
    localStorage.setItem('quest_tasks', JSON.stringify(tasks));
    localStorage.setItem('quest_stats', JSON.stringify(stats));
    localStorage.setItem('quest_party', JSON.stringify(party));
    setIsSyncing(false);
  }, [tasks, stats, party]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        mana: Math.min(100, prev.mana + 1)
      }));
    }, 60000); // 1 mana per minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    if (stats.lastLogin !== today) {
      setShowBonus(true);
    }
  }, []);

  const claimBonus = () => {
    const today = new Date().toDateString();
    setStats(prev => ({
      ...prev,
      gold: prev.gold + 100,
      xp: prev.xp + 200,
      lastLogin: today
    }));
    setShowBonus(false);
    syncWithCloud();
  };

  const addMinutes = (minutes: number) => {
    setStats(prev => {
      const newMinutes = prev.totalMinutes + minutes;
      const bonus = party ? 1.2 : 1.0; 
      const gainedXP = Math.floor(minutes * 5 * bonus);
      const newXP = prev.xp + gainedXP;
      const newLevel = Math.floor(newXP / 1000) + 1;
      
      return {
        ...prev,
        totalMinutes: newMinutes,
        xp: newXP,
        level: newLevel,
        gold: prev.gold + Math.floor(minutes / 5)
      };
    });
    syncWithCloud();
  };

  const updateTimerSettings = (work: number, rest: number) => {
    setStats(prev => ({ ...prev, timerSettings: { work, break: rest } }));
  };

  const handleTaskToggle = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.completed) {
          setStats(s => ({ ...s, xp: s.xp + t.xp, gold: s.gold + 10 }));
        }
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleMaintenance = (action: string, data?: any) => {
    if (action === 'repair') setStats(prev => validateStats(prev));
    if (action === 'reset') { 
      if(confirm("Erase all study chronicles?")) {
        localStorage.clear(); 
        window.location.reload(); 
      }
    }
    if (action === 'import' && data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.stats) setStats(validateStats(parsed.stats));
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.party) setParty(parsed.party);
        alert("Scroll Imported Successfully!");
      } catch (e) {
        alert("Malformed scroll data.");
      }
    }
  };

  const handlePurchase = (skin: any) => {
    if (stats.xp >= skin.cost && !stats.unlockedSkins.includes(skin.id)) {
      setStats(prev => ({
        ...prev,
        xp: prev.xp - skin.cost,
        unlockedSkins: [...prev.unlockedSkins, skin.id]
      }));
      return true;
    }
    return false;
  };

  const renderView = () => {
    switch (view) {
      case 'home': return <Hero onStart={() => setView('tasks')} />;
      case 'tasks': return <TodoList tasks={tasks} setTasks={setTasks} onToggle={handleTaskToggle} isPartyActive={!!party} />;
      case 'timer': return (
        <Pomodoro 
          onComplete={addMinutes} 
          party={party} 
          settings={stats.timerSettings} 
          onUpdateSettings={updateTimerSettings}
          deepFocus={deepFocus}
          setDeepFocus={setDeepFocus}
        />
      );
      case 'stats': return <Statistics stats={stats} tasks={tasks} party={party} onMaintenance={handleMaintenance} />;
      case 'ai': return <AISuggestions tasks={tasks} setTasks={setTasks} isPartyActive={!!party} mana={stats.mana} onUseMana={(amt) => setStats(s => ({...s, mana: s.mana - amt}))} />;
      case 'party': return <PartyView party={party} setParty={setParty} />;
      case 'shop': return <Shop stats={stats} setStats={setStats} onPurchase={handlePurchase} />;
      case 'leaderboard': return <Leaderboard userStats={stats} />;
      default: return <Hero onStart={() => setView('tasks')} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 ${deepFocus ? 'bg-black' : stats.activeBackground}`}>
      {!deepFocus && <Navbar stats={stats} setView={setView} activeView={view} isSyncing={isSyncing} onSync={syncWithCloud} />}
      <main className={`flex-1 overflow-y-auto ${deepFocus ? '' : 'pt-16 pb-24 md:pb-8'}`}>
        {renderView()}
      </main>

      {showBonus && <DailyBonusModal onClaim={claimBonus} />}
      
      {!deepFocus && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1f2833] border-t-4 border-black p-2 flex justify-around items-center z-50">
          <button onClick={() => setView('home')} className={`p-2 ${view === 'home' ? 'text-yellow-400' : 'text-white'}`}>🏠</button>
          <button onClick={() => setView('tasks')} className={`p-2 ${view === 'tasks' ? 'text-yellow-400' : 'text-white'}`}>⚔️</button>
          <button onClick={() => setView('timer')} className={`p-2 ${view === 'timer' ? 'text-yellow-400' : 'text-white'}`}>⏳</button>
          <button onClick={() => setView('shop')} className={`p-2 ${view === 'shop' ? 'text-yellow-400' : 'text-white'}`}>💎</button>
          <button onClick={() => setView('leaderboard')} className={`p-2 ${view === 'leaderboard' ? 'text-yellow-400' : 'text-white'}`}>🏆</button>
          <button onClick={() => setView('stats')} className={`p-2 ${view === 'stats' ? 'text-yellow-400' : 'text-white'}`}>📈</button>
        </div>
      )}
    </div>
  );
};

export default App;
