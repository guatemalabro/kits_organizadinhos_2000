
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-border">
      <div className="container-content flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          SampleSort — Organize your samples with elegance
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
