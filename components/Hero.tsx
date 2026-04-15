
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] sky-bg flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      {/* Pixel Clouds / Decorations */}
      <div className="absolute top-20 left-10 text-6xl opacity-20">☁️</div>
      <div className="absolute top-40 right-20 text-4xl opacity-10">☁️</div>
      <div className="absolute bottom-40 left-1/4 text-4xl opacity-50">🌸</div>
      <div className="absolute bottom-60 right-1/4 text-3xl opacity-30">🌻</div>

      <div className="max-w-4xl mx-auto space-y-8 z-10">
        <h2 className="pixel-font text-xl md:text-2xl text-blue-900 mb-2">START YOUR</h2>
        <h1 className="pixel-font text-3xl sm:text-5xl md:text-7xl text-white drop-shadow-[4px_4px_0px_#000] leading-tight">
          Study <br /> Adventure
        </h1>
        
        <p className="retro-font text-2xl md:text-3xl text-gray-800 max-w-lg mx-auto font-bold">
          The most fun and gamified way to master your subjects. ✨💎
        </p>

        <div className="pt-4">
          <button 
            onClick={onStart}
            className="pixel-button pixel-font text-sm md:text-lg px-8 py-4 bg-yellow-400 text-black border-4 border-black"
          >
            Enter the Dungeon
          </button>
        </div>

        <div className="pt-12 flex flex-col items-center gap-4 opacity-70">
          <p className="pixel-font text-[10px] text-gray-700">POWERED BY KNOWLEDGE</p>
          <div className="flex gap-8 items-center text-4xl grayscale">
             <span>📚</span>
             <span>🧠</span>
             <span>🔥</span>
          </div>
        </div>
      </div>

      {/* Grass base */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#5e9e5e] border-t-4 border-black"></div>
    </div>
  );
};
