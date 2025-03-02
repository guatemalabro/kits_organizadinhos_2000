
import React from 'react';
import { useSampleContext } from '@/context/SampleContext';

const Header: React.FC = () => {
  const { resetAll } = useSampleContext();
  
  return (
    <header className="w-full py-8 border-b border-green-500/20 animate-fade-in bg-zinc-900/50 shadow-lg backdrop-blur-sm vhs-border">
      <div className="container-content flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="text-sm uppercase tracking-wider text-green-400/70">
              Professional Audio Tool
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)] vhs-text">
              Kits Organizadinhos 2000
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={resetAll}
            className="text-sm text-green-400 hover:text-green-300 transition-colors focus-ring px-4 py-2 rounded-md border border-green-500/20 hover:border-green-500/40 hover:bg-green-500/10 vhs-glow"
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
