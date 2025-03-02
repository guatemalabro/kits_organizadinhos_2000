
import React from 'react';
import { useSampleContext } from '@/context/SampleContext';

const Header: React.FC = () => {
  const { resetAll } = useSampleContext();
  
  return (
    <header className="w-full py-8 border-b border-green-500/30 animate-fade-in bg-zinc-900/80 shadow-lg">
      <div className="container-content flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="text-sm uppercase tracking-wider text-green-400/70">
              Professional Audio Tool
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse">
              Kits Organizadinhos 2000
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={resetAll}
            className="text-sm text-green-400 hover:text-green-300 transition-colors focus-ring px-4 py-2 rounded-md border border-green-500/30 hover:border-green-500/60 hover:bg-green-500/10"
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
