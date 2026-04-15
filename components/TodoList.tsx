
import React, { useState } from 'react';
import { Task } from '../types';
import { sanitizeText, validateString, RATE_LIMITS } from '../utils/security';

interface TodoListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onToggle: (id: string) => void;
  isPartyActive?: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({ tasks, setTasks, onToggle, isPartyActive }) => {
  const [inputValue, setInputValue] = useState('');
  const [isPartyTask, setIsPartyTask] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    const validation = validateString(inputValue, { 
      min: 1, 
      max: RATE_LIMITS.MAX_TASK_LENGTH 
    });

    if (!validation.valid) {
      setError(validation.error || 'Invalid input');
      return;
    }
    
    const sanitized = sanitizeText(inputValue.trim());
    
    const newTask: Task = {
      id: crypto.randomUUID(), // More secure than Date.now()
      text: sanitized,
      completed: false,
      xp: 25 + Math.floor(Math.random() * 25),
      isPartyQuest: isPartyTask
    };
    
    setTasks([newTask, ...tasks]);
    setInputValue('');
    setIsPartyTask(false);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="pixel-font text-2xl text-yellow-400">ACTIVE QUESTS</h2>
        <p className="retro-font text-xl text-gray-400">Defeat tasks to gain XP and gold!</p>
      </div>

      <form onSubmit={addTask} className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter a new quest..."
              className={`flex-1 bg-[#1f2833] border-4 p-4 pixel-font text-xs text-white focus:outline-none ${error ? 'border-red-500' : 'border-black focus:border-yellow-400'}`}
              maxLength={RATE_LIMITS.MAX_TASK_LENGTH}
            />
            <button 
              type="submit"
              className="pixel-button pixel-font text-xs bg-green-500"
            >
              Add
            </button>
          </div>
          {error && <p className="pixel-font text-[8px] text-red-500 uppercase">{error}</p>}
        </div>
        {isPartyActive && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isPartyTask} 
              onChange={(e) => setIsPartyTask(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="pixel-font text-[10px] text-blue-400 uppercase">Share with Guild (Bonus Rewards)</span>
          </label>
        )}
      </form>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="p-12 text-center bg-[#1f2833] pixel-border border-4 border-dashed border-gray-600">
            <p className="pixel-font text-xs text-gray-500">NO QUESTS LOGGED. <br/><br/> RESTING AT THE TAVERN...</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`flex items-center gap-4 p-4 bg-[#1f2833] pixel-border transition-all ${task.completed ? 'opacity-50' : 'hover:border-yellow-400'} ${task.isPartyQuest ? 'border-l-8 border-l-blue-500' : ''}`}
            >
              <button 
                onClick={() => onToggle(task.id)}
                className={`w-8 h-8 flex items-center justify-center border-4 border-black ${task.completed ? 'bg-green-500' : 'bg-[#0b0c10]'}`}
                aria-label={task.completed ? "Unmark as completed" : "Mark as completed"}
              >
                {task.completed && '✔️'}
              </button>
              
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <p className={`pixel-font text-xs truncate ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                    {task.text}
                  </p>
                  {task.isPartyQuest && <span className="text-[8px] bg-blue-600 px-1 pixel-font text-white uppercase">Guild</span>}
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] pixel-font text-blue-400">+{task.isPartyQuest ? Math.floor(task.xp * 1.5) : task.xp} XP</span>
                  <span className="text-[10px] pixel-font text-yellow-400">+10 GOLD</span>
                </div>
              </div>

              <button 
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-400 pixel-font text-xs p-2"
                aria-label="Delete task"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
