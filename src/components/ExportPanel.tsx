
import React from 'react';
import { useSampleContext } from '@/context/SampleContext';

const ExportPanel: React.FC = () => {
  const { 
    samples, 
    isExporting, 
    exportSamples, 
    resetAll, 
    categories,
    getCategoryCount
  } = useSampleContext();

  if (samples.length === 0) {
    return null;
  }

  // Get selected categories
  const selectedCategories = categories.filter(cat => cat.selected);
  
  // Calculate total samples to export and samples per category using getCategoryCount
  const totalToExport = selectedCategories.reduce(
    (sum, category) => sum + getCategoryCount(category.id), 
    0
  );

  return (
    <div className="w-full border rounded-xl p-8 bg-zinc-900/80 border-green-500/30 animate-fade-in shadow-[0_0_30px_rgba(74,222,128,0.1)] backdrop-blur-sm">
      <h3 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500 drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]">Export Selected Samples</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {selectedCategories.map(category => {
          // Get accurate count for this category
          const categoryCount = getCategoryCount(category.id);
          if (categoryCount === 0) return null;
          
          return (
            <div key={category.id} className="bg-zinc-800/80 border border-green-500/30 rounded-lg p-4 text-center hover:border-green-500/60 hover:bg-green-900/20 transition-all shadow-md">
              <h4 className="font-semibold text-green-400 mb-1">{category.name}</h4>
              <p className="text-green-300/70 text-sm">{categoryCount} samples</p>
            </div>
          );
        })}
      </div>
      
      {totalToExport > 0 ? (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-center text-green-300/80">
            {totalToExport === 1 
              ? '1 sample will be exported' 
              : `${totalToExport} samples will be exported`}
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={exportSamples}
              disabled={isExporting}
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-ring shadow-[0_0_15px_rgba(74,222,128,0.3)] hover:shadow-[0_0_20px_rgba(74,222,128,0.5)]"
            >
              {isExporting ? 'Creating ZIP...' : 'Export as ZIP'}
            </button>
            
            <button
              onClick={resetAll}
              className="px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-green-300 font-medium transition-colors focus-ring border border-green-500/30 hover:border-green-500/60"
            >
              Reset All
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-green-300/70">No samples selected for export</p>
      )}
    </div>
  );
};

export default ExportPanel;
