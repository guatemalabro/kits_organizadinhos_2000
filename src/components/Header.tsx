
import React from 'react';
import { useSampleContext } from '@/context/SampleContext';

const Header: React.FC = () => {
  const { resetAll } = useSampleContext();
  
  return (
    <header className="w-full py-6 border-b border-border animate-fade-in">
      <div className="container-content flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="text-sm uppercase tracking-wider text-muted-foreground">
              Sample Organizer
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              SampleSort
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={resetAll}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring px-4 py-2 rounded-md"
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
