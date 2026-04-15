
import React, { useState, useEffect, useRef } from 'react';
import { Party } from '../types';

interface PomodoroProps {
  onComplete: (minutes: number) => void;
  party: Party | null;
  settings: { work: number; break: number };
  onUpdateSettings: (work: number, rest: number) => void;
  deepFocus: boolean;
  setDeepFocus: (v: boolean) => void;
}

type Mode = 'work' | 'break';

export const Pomodoro: React.FC<PomodoroProps> = ({ onComplete, party, settings, onUpdateSettings, deepFocus, setDeepFocus }) => {
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(mode === 'work' ? settings.work * 60 : settings.break * 60);
    }
  }, [settings, mode, isActive]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (mode === 'work') {
      onComplete(settings.work);
      setMode('break');
      setTimeLeft(settings.break * 60);
    } else {
      setMode('work');
      setTimeLeft(settings.work * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (deepFocus) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] animate-fade-in">
        <div className="text-center space-y-12">
          <h2 className="pixel-font text-xl text-gray-500 tracking-[1em] uppercase">Deep Focus</h2>
          <div className="text-[12rem] md:text-[20rem] font-bold text-white tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {formatTime(timeLeft)}
          </div>
          <div className="flex gap-12 justify-center">
            <button onClick={() => setIsActive(!isActive)} className="text-white pixel-font text-2xl hover:text-yellow-400">
              {isActive ? 'PAUSE' : 'RESUME'}
            </button>
            <button onClick={() => setDeepFocus(false)} className="text-gray-700 pixel-font text-sm hover:text-red-500">
              EXIT FOCUS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-8 lg:p-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className={`w-full max-w-2xl p-4 sm:p-8 md:p-16 lg:p-20 rounded-lg pixel-border transition-all duration-500 relative shadow-2xl ${mode === 'work' ? 'bg-[#1f2833]' : 'bg-[#2b4b3b]'}`}>
        
        <div className="absolute top-2 right-2 md:top-6 md:right-6 flex gap-1 md:gap-2 z-30">
           <button onClick={() => setDeepFocus(true)} className="p-1 md:p-2 bg-black/20 rounded-full text-base md:text-xl" title="Deep Focus Mode">👁️</button>
           <button onClick={() => setShowSettings(!showSettings)} className="p-1 md:p-2 bg-black/20 rounded-full text-base md:text-xl">⚙️</button>
        </div>

        {showSettings && !isActive && (
          <div className="absolute inset-x-2 md:inset-x-8 top-12 md:top-20 z-40 p-4 md:p-6 bg-[#0b0c10] pixel-border space-y-4 animate-fade-in shadow-2xl">
            <h3 className="pixel-font text-[10px] md:text-xs text-yellow-400 text-center uppercase">Settings</h3>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <div className="flex flex-col gap-1">
                <label className="pixel-font text-[8px] text-gray-400">WORK</label>
                <input type="number" value={settings.work} onChange={(e) => onUpdateSettings(parseInt(e.target.value) || 1, settings.break)} className="bg-black p-2 pixel-font text-[10px] text-white border border-gray-800 w-full" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="pixel-font text-[8px] text-gray-400">REST</label>
                <input type="number" value={settings.break} onChange={(e) => onUpdateSettings(settings.work, parseInt(e.target.value) || 1)} className="bg-black p-2 pixel-font text-[10px] text-white border border-gray-800 w-full" />
              </div>
            </div>
            <button onClick={() => setShowSettings(false)} className="pixel-button w-full text-[10px]">Apply</button>
          </div>
        )}

        <div className="text-center space-y-4 md:space-y-6">
          <h2 className="pixel-font text-[10px] sm:text-xl md:text-3xl text-white uppercase tracking-tight sm:tracking-[0.2em] px-10">
            {mode === 'work' ? (party ? '🛡️ GUILD FOCUS' : '⚔️ SOLO QUEST') : '🧘 RECOVERY'}
          </h2>
          <div className="pixel-font text-4xl sm:text-6xl md:text-8xl text-yellow-400 py-4 md:py-8 whitespace-nowrap overflow-hidden text-ellipsis">
            {formatTime(timeLeft)}
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center">
            <button onClick={() => setIsActive(!isActive)} className={`pixel-button py-3 md:py-4 px-8 md:px-12 text-sm md:text-lg ${isActive ? 'bg-orange-500' : 'bg-green-500'}`}>
              {isActive ? 'PAUSE' : 'START'}
            </button>
            <button onClick={() => { setIsActive(false); setTimeLeft(settings.work * 60); }} className="pixel-button py-3 md:py-4 px-8 md:px-12 text-sm md:text-lg bg-gray-500">
              RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
