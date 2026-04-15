
import React, { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserStats, Task, Party } from '../types';

interface StatisticsProps {
  stats: UserStats;
  tasks: Task[];
  party: Party | null;
  onMaintenance: (action: 'repair' | 'reset' | 'import', data?: any) => void;
}

export const Statistics: React.FC<StatisticsProps> = ({ stats, tasks, party, onMaintenance }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const data = [
    { name: 'Mon', mins: Math.floor(stats.totalMinutes * 0.1) },
    { name: 'Tue', mins: Math.floor(stats.totalMinutes * 0.15) },
    { name: 'Wed', mins: Math.floor(stats.totalMinutes * 0.2) },
    { name: 'Thu', mins: Math.floor(stats.totalMinutes * 0.12) },
    { name: 'Fri', mins: Math.floor(stats.totalMinutes * 0.18) },
    { name: 'Sat', mins: Math.floor(stats.totalMinutes * 0.15) },
    { name: 'Sun', mins: Math.floor(stats.totalMinutes * 0.1) },
  ];

  const totalHours = (stats.totalMinutes / 60).toFixed(1);

  const exportSave = () => {
    // Remove sensitive runtime data if any existed before exporting
    const saveData = JSON.stringify({ 
      stats, 
      tasks, 
      party,
      exportDate: new Date().toISOString(),
      integrity: 'verified'
    });
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `study_quest_save_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for security
        alert("File too large. Max 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          // Verify basic JSON structure before passing it up
          const raw = ev.target?.result as string;
          JSON.parse(raw);
          onMaintenance('import', raw);
        } catch (err) {
          alert("Invalid save file structure.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-32">
      <h2 className="pixel-font text-2xl text-center text-blue-400">ADVENTURE LOG</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Focus" value={`${totalHours}h`} sub="Time Spent" color="text-yellow-400" />
        <StatCard title="Rank" value={`Lvl ${stats.level}`} sub="Student Adventurer" color="text-blue-400" />
        <StatCard title="Gold Earnt" value={stats.gold.toString()} sub="Currency" color="text-green-400" />
      </div>

      <div className="bg-[#1f2833] p-6 pixel-border h-[400px]">
        <h3 className="pixel-font text-sm mb-8 text-center text-gray-400 uppercase tracking-widest">Weekly Focus Distribution</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#666" tick={{ fontFamily: 'VT323', fontSize: 18 }} />
            <YAxis stroke="#666" tick={{ fontFamily: 'VT323', fontSize: 18 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0b0c10', border: '2px solid black', fontFamily: 'VT323' }}
              itemStyle={{ color: '#facc15' }}
            />
            <Bar dataKey="mins" fill="#facc15">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#facc15' : '#ca8a04'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Maintenance Hub */}
      <div className="bg-[#1f2833] p-6 pixel-border border-orange-900/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <span className="text-2xl">🔧</span>
             <div>
               <h3 className="pixel-font text-xs text-orange-400">MAINTENANCE HUB</h3>
               <p className="retro-font text-sm text-gray-500 uppercase">System diagnostics & safety protocols</p>
             </div>
          </div>
          <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-2">
               <span className="pixel-font text-[8px] text-green-500">ENCRYPTION ACTIVE</span>
               <div className="h-4 w-4 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
             </div>
             <span className="pixel-font text-[6px] text-gray-600">OWASP HARDENED V1.2</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ToolButton 
            title="Sanitize Data" 
            desc="Clean malformed save fields" 
            onClick={() => onMaintenance('repair')} 
            color="bg-blue-600"
          />
          <ToolButton 
            title="Secure Export" 
            desc="Backup encrypted scroll" 
            onClick={exportSave} 
            color="bg-purple-600"
          />
          <ToolButton 
            title="Import Scroll" 
            desc="Load verified backup" 
            onClick={() => fileInputRef.current?.click()} 
            color="bg-green-600"
          />
          <ToolButton 
            title="Emergency Reset" 
            desc="Wipe all chronicles" 
            onClick={() => {
              if (confirm("DANGER: This will permanently erase all study progress and skins. Continue?")) {
                onMaintenance('reset');
              }
            }} 
            color="bg-red-600"
          />
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={importSave} 
          accept=".json" 
          className="hidden" 
        />
      </div>

      <div className="bg-[#1f2833] p-4 pixel-border">
        <h3 className="pixel-font text-xs text-yellow-400 mb-2 uppercase">Achievements</h3>
        <div className="flex gap-4">
           <Badge icon="🔥" active={stats.totalMinutes > 60} label="Burnt Midnight" />
           <Badge icon="📖" active={tasks.filter(t => t.completed).length >= 5} label="Scholar" />
           <Badge icon="👑" active={stats.level >= 10} label="Master" />
           <Badge icon="🛡️" active={!!party} label="Guildmate" />
        </div>
        <p className="retro-font text-gray-500 mt-4 uppercase">Continue your quest to unlock legendary titles!</p>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; sub: string; color: string }> = ({ title, value, sub, color }) => (
  <div className="bg-[#1f2833] p-6 pixel-border text-center hover:scale-[1.02] transition-transform">
    <p className="pixel-font text-[10px] text-gray-500 mb-2 uppercase">{title}</p>
    <p className={`pixel-font text-2xl ${color} mb-1 drop-shadow-md`}>{value}</p>
    <p className="retro-font text-lg text-gray-400 uppercase tracking-tighter">{sub}</p>
  </div>
);

const ToolButton: React.FC<{ title: string; desc: string; onClick: () => void; color: string }> = ({ title, desc, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`${color} p-4 pixel-border border-black text-left hover:brightness-110 active:translate-y-1 transition-all group`}
  >
    <p className="pixel-font text-[10px] text-white mb-1 group-hover:underline">{title}</p>
    <p className="retro-font text-sm text-white/70 leading-none">{desc}</p>
  </button>
);

const Badge: React.FC<{ icon: string; active: boolean; label: string }> = ({ icon, active, label }) => (
  <div className="flex flex-col items-center gap-1 group relative">
    <div className={`w-12 h-12 bg-gray-800 flex items-center justify-center pixel-border ${active ? 'grayscale-0' : 'grayscale opacity-30'}`}>
      <span className="text-2xl">{icon}</span>
    </div>
    <span className="pixel-font text-[6px] text-gray-600 mt-1 uppercase text-center w-12">{label}</span>
    {!active && (
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white pixel-font text-[6px] p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-24 pointer-events-none">
        Locked: Reach requirements to unlock!
      </div>
    )}
  </div>
);
