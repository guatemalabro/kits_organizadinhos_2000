
import React from 'react';
import { useSampleContext } from '@/context/SampleContext';

const ExportPanel: React.FC = () => {
  const { 
    samples, 
    exportSamples, 
    selectedSamplesCount, 
    categories,
    isExporting,
    isAnalyzing 
  } = useSampleContext();
  
  if (samples.length === 0 || isAnalyzing) {
    return null;
  }
  
  const selectedCategories = categories
    .filter(cat => cat.selected && cat.count > 0)
    .map(cat => cat.name)
    .join(', ');
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-xl bg-primary/5 border border-primary/20 animate-fade-in">
      <div className="mb-4 md:mb-0">
        <h3 className="text-lg font-medium mb-1">Export Selected Samples</h3>
        <p className="text-sm text-muted-foreground">
          {selectedSamplesCount === 0 ? (
            <span>No samples selected</span>
          ) : (
            <span>
              {selectedSamplesCount} {selectedSamplesCount === 1 ? 'sample' : 'samples'} selected from {selectedCategories}
            </span>
          )}
        </p>
      </div>
      
      <button
        onClick={exportSamples}
        disabled={selectedSamplesCount === 0 || isExporting}
        className={`px-6 py-3 rounded-lg font-medium transition-all focus-ring ${
          selectedSamplesCount === 0 || isExporting
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary/90'
        } flex items-center`}
      >
        {isExporting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export Samples
          </>
        )}
      </button>
    </div>
  );
};

export default ExportPanel;
