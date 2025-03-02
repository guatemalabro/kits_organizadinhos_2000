
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
    <div className="w-full border rounded-xl p-8 bg-orange-500/10 border-orange-500/20 animate-fade-in">
      <h3 className="text-xl font-medium mb-6 text-center">Export Selected Samples</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {selectedCategories.map(category => {
          // Get accurate count for this category
          const categoryCount = getCategoryCount(category.id);
          if (categoryCount === 0) return null;
          
          return (
            <div key={category.id} className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-orange-300 mb-1">{category.name}</h4>
              <p className="text-muted-foreground text-sm">{categoryCount} samples</p>
            </div>
          );
        })}
      </div>
      
      {totalToExport > 0 ? (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-center text-muted-foreground">
            {totalToExport === 1 
              ? '1 sample will be exported' 
              : `${totalToExport} samples will be exported`}
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={exportSamples}
              disabled={isExporting}
              className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-ring"
            >
              {isExporting ? 'Creating ZIP...' : 'Export as ZIP'}
            </button>
            
            <button
              onClick={resetAll}
              className="px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors focus-ring"
            >
              Reset All
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No samples selected for export</p>
      )}
    </div>
  );
};

export default ExportPanel;
