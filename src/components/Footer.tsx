
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-gray-700/30 bg-zinc-900/30 backdrop-blur-sm vhs-border">
      <div className="container-content flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-400/80 vhs-text" data-text="Kits Organizadinhos 2000 — Organize your samples with precision">
          Kits Organizadinhos 2000 — Organize your samples with precision
        </div>
        <div className="text-sm">
          <span className="px-3 py-1 rounded-full bg-gray-900/50 text-gray-400 text-xs font-medium border border-gray-700/30 vhs-glow">
            v2.0.0
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
