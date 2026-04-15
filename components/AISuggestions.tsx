
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Task } from '../types';
import { sanitizeText, validateString, RateLimiter, RATE_LIMITS } from '../utils/security';

interface AISuggestionsProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isPartyActive?: boolean;
  mana: number;
  onUseMana: (amt: number) => void;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({ tasks, setTasks, isPartyActive, mana, onUseMana }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{advice: string; roadmap: string[]} | null>(null);
  const [showPromptInsights, setShowPromptInsights] = useState(false);

  const MANA_COST = 20;

  // The PTCF (Persona, Task, Context, Format) Golden Prompt
  const PERSONA = "Legendary High-Mage of Pedagogy, an ancient master of knowledge and educational psychology.";
  const TASK = "Transform the study topic into a Master Study Blueprint including Sage's Advice, a 5-step Sequential Roadmap, and 3 specific Daily Quests.";
  const CONTEXT = "The user is an adventurer in 'Study Quest', a pixel-art RPG library. Ensure advice is tactical (e.g., active recall, Feynman technique) and quests feel like subject-specific missions.";
  const FORMAT = "Strict JSON object with advice (string), roadmap (array of 5 strings), and quests (array of 3 objects with title and difficulty_xp).";

  const getHelp = async () => {
    setError(null);
    
    const validation = validateString(prompt, { 
      min: 5, 
      max: RATE_LIMITS.MAX_PROMPT_LENGTH 
    });
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid prompt');
      return;
    }

    const rateCheck = RateLimiter.canExecute(RATE_LIMITS.AI_REQUESTS_PER_MINUTE, 60000);
    if (!rateCheck.allowed) {
      setError(`The Sage is meditating. Wait ${rateCheck.waitTime}s`);
      return;
    }

    if (mana < MANA_COST) {
      setError('Insufficient Mana');
      return;
    }

    setLoading(true);
    onUseMana(MANA_COST);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sanitizedPrompt = sanitizeText(prompt.trim());

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Study Topic Request: ${sanitizedPrompt}.`,
        config: {
          systemInstruction: `
            [Persona] ${PERSONA}
            [Task] ${TASK}
            [Context] ${CONTEXT}
            [Format] ${FORMAT}
          `,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              advice: { type: Type.STRING },
              roadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
              quests: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { 
                    title: { type: Type.STRING }, 
                    difficulty_xp: { type: Type.NUMBER } 
                  },
                  required: ["title", "difficulty_xp"]
                }
              }
            },
            required: ["advice", "roadmap", "quests"]
          }
        }
      });

      const rawText = response.text || "{}";
      const data = JSON.parse(rawText);
      
      setSuggestion({ 
        advice: sanitizeText(data.advice || "No advice provided."), 
        roadmap: (data.roadmap || []).map((s: string) => sanitizeText(s)) 
      });

      const newTasks: Task[] = (data.quests || []).map((q: any) => ({
        id: crypto.randomUUID(),
        text: sanitizeText(q.title || "AI Quest"),
        completed: false,
        xp: Math.min(500, q.difficulty_xp || 50)
      }));
      
      setTasks(prev => [...newTasks, ...prev]);
      setPrompt('');
    } catch (err: any) {
      console.error("AI Error:", err);
      setError(err.message?.includes("429") ? "The scrolls are busy. Try later." : "Connection failed. The Sage's mana is unstable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8 pb-32">
      <div className="text-center space-y-4">
        <h2 className="pixel-font text-2xl text-purple-400">THE GREAT LIBRARY</h2>
        <div className="flex justify-center items-center gap-2">
          <span className="text-purple-400 pixel-font text-[10px]">MANA: {mana}/100</span>
          <div className="w-32 h-2 bg-gray-900 border border-black overflow-hidden">
            <div className="h-full bg-purple-500 transition-all" style={{ width: `${mana}%` }}></div>
          </div>
        </div>
      </div>

      <div className={`bg-[#1f2833] pixel-border p-6 flex flex-col gap-4 relative ${error ? 'border-red-500' : ''}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="pixel-font text-[8px] text-gray-400">INPUT TOPIC</span>
          <button 
            onClick={() => setShowPromptInsights(!showPromptInsights)}
            className="pixel-font text-[8px] text-purple-400 hover:underline"
          >
            {showPromptInsights ? '[HIDE PROMPT LOGIC]' : '[VIEW PROMPT LOGIC]'}
          </button>
        </div>

        {showPromptInsights && (
          <div className="bg-black/50 p-4 border-2 border-purple-500/30 mb-2 space-y-3 text-[9px] retro-font animate-fade-in">
            <div className="text-purple-400 uppercase font-bold">PTCF Prompt Architecture:</div>
            <div><span className="text-blue-400 font-bold">P:</span> {PERSONA}</div>
            <div><span className="text-green-400 font-bold">T:</span> {TASK}</div>
            <div><span className="text-yellow-400 font-bold">C:</span> {CONTEXT}</div>
            <div><span className="text-red-400 font-bold">F:</span> {FORMAT}</div>
          </div>
        )}

        <textarea 
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (error) setError(null);
          }}
          placeholder="What topic shall we master? (e.g. Organic Chemistry, UI Design)"
          className="w-full h-24 bg-[#0b0c10] border-4 border-black p-4 pixel-font text-[10px] text-white focus:outline-none focus:border-purple-400 resize-none"
          maxLength={RATE_LIMITS.MAX_PROMPT_LENGTH}
        />
        
        {error && <p className="pixel-font text-[8px] text-red-500 text-center uppercase animate-pulse">{error}</p>}

        <button 
          onClick={getHelp}
          disabled={loading || mana < MANA_COST || prompt.length < 5}
          className={`pixel-button pixel-font text-xs h-12 flex items-center justify-center ${loading || mana < MANA_COST || prompt.length < 5 ? 'bg-gray-600 opacity-50' : 'bg-purple-600'}`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">🌀</span> SUMMONING WISDOM...
            </span>
          ) : mana < MANA_COST ? 'INSUFFICIENT MANA' : `CAST STUDY GUIDANCE (-${MANA_COST} MP)`}
        </button>
        <p className="retro-font text-[10px] text-gray-500 text-center uppercase italic">Powered by Advanced PTCF Prompt Engineering</p>
      </div>

      {suggestion && (
        <div className="bg-[#fefce8] text-black pixel-border p-6 animate-fade-in space-y-4 relative border-purple-900/20">
          <div className="absolute -top-4 -right-4 text-4xl transform rotate-12">📜</div>
          <button 
            onClick={() => setSuggestion(null)} 
            className="absolute top-2 right-2 text-xs font-bold w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded-full"
            aria-label="Close"
          >
            ✕
          </button>
          
          <div className="border-b-2 border-black/10 pb-2">
            <h3 className="pixel-font text-xs uppercase text-purple-800">The Sage's Verdict</h3>
            <p className="retro-font text-xl italic leading-tight mt-2">"{suggestion.advice}"</p>
          </div>

          <div className="space-y-3">
             <h4 className="pixel-font text-[10px] text-gray-600 uppercase">Sequential Roadmap:</h4>
             <div className="bg-white/50 p-4 space-y-3 pixel-border border-black/10">
                {suggestion.roadmap.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="bg-purple-800 text-white w-5 h-5 flex-shrink-0 flex items-center justify-center text-[10px] pixel-font">
                      {i+1}
                    </span>
                    <p className="retro-font text-lg leading-tight">{step}</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <div className="flex-1 h-[2px] bg-purple-800/20"></div>
            <p className="pixel-font text-[8px] text-purple-600 uppercase">3 New Quests Logged in your Diary</p>
            <div className="flex-1 h-[2px] bg-purple-800/20"></div>
          </div>
        </div>
      )}
    </div>
  );
};
