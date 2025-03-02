
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-green-500/20 bg-zinc-900/30 backdrop-blur-sm">
      <div className="container-content flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-green-400/70">
          Kits Organizadinhos 2000 — Organize your samples with precision
        </div>
        <div className="text-sm">
          <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-medium border border-green-500/20">
            v2.0.0
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
