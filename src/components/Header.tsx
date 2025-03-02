
import React from 'react';
import { useSampleContext } from '@/context/SampleContext';

const Header: React.FC = () => {
  const { resetAll } = useSampleContext();
  
  return (
    <header className="w-full py-8 border-b border-gray-700/20 animate-fade-in bg-zinc-900/50 shadow-lg backdrop-blur-sm vhs-border">
      <div className="container-content flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center">
          <div className="text-sm uppercase tracking-wider text-gray-400/70">
            Professional Audio Tool
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-500 drop-shadow-[0_0_8px_rgba(160,160,160,0.7)] vhs-text">
            Kits Organizadinhos 2000
          </h1>
        </div>
        
        <div className="mt-4">
          <button
            onClick={resetAll}
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors focus-ring px-4 py-2 rounded-md border border-gray-500/20 hover:border-gray-500/40 hover:bg-gray-500/10 vhs-glow"
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
