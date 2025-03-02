
import React from 'react';
import { useSampleContext } from '@/context/SampleContext';
import { SampleCategory } from '@/context/SampleContext';

const CategorySelector: React.FC = () => {
  const { 
    categories, 
    toggleCategory, 
    selectAllCategories, 
    unselectAllCategories,
    selectedSamplesCount,
    samples,
    isAnalyzing,
    getCategoryCount
  } = useSampleContext();

  if (samples.length === 0 && !isAnalyzing) {
    return null;
  }

  const CategoryItem: React.FC<{ category: SampleCategory }> = ({ category }) => {
    // Use getCategoryCount to get accurate count
    const actualCount = getCategoryCount(category.id);
    
    return (
      <div 
        className={`flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200 cursor-pointer ${
          category.selected 
            ? 'bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30' 
            : 'bg-zinc-800/80 hover:bg-zinc-700/50 border border-zinc-700/50'
        }`}
        onClick={() => toggleCategory(category.id)}
      >
        <div className="flex items-center">
          <div 
            className={`w-5 h-5 rounded-sm mr-3 flex items-center justify-center transition-colors ${
              category.selected ? 'bg-orange-500' : 'bg-zinc-700'
            }`}
          >
            {category.selected && (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-white"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="font-medium tracking-tight">{category.name}</span>
        </div>
        <div className="flex items-center">
          <span className={`text-sm rounded-full px-2.5 py-0.5 ${
            actualCount > 0 
              ? category.selected 
                ? 'bg-orange-500/20 text-orange-400' 
                : 'bg-zinc-700 text-zinc-300' 
              : 'bg-zinc-800 text-zinc-500'
          }`}>
            {actualCount}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col space-y-1 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium tracking-tighter">Categories</h3>
          <div className="flex items-center space-x-4">
            <button 
              onClick={selectAllCategories}
              className="text-xs text-orange-400 hover:text-orange-300 transition-colors focus-ring"
            >
              Select All
            </button>
            <button 
              onClick={unselectAllCategories}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              Deselect All
            </button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {selectedSamplesCount === 0 ? (
            <span>No samples selected</span>
          ) : selectedSamplesCount === 1 ? (
            <span>1 sample selected</span>
          ) : (
            <span>{selectedSamplesCount} samples selected</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {categories.map(category => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
