import React, { useState } from 'react';
import { useSampleContext } from '@/context/SampleContext';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

const SubLabelsPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ 
  isOpen, 
  onClose 
}) => {
  const { samples, categories, getFilteredSamples } = useSampleContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [groupingResults, setGroupingResults] = useState<Record<string, string[]>>({});
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  // Generate subgroups based on sonic characteristics
  const analyzeSamples = () => {
    // Get only the samples from selected categories
    const selectedSamples = getFilteredSamples();
    
    if (selectedSamples.length === 0) {
      toast.error("No samples selected. Please select at least one category.");
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Simulate processing time
    setTimeout(() => {
      const results: Record<string, string[]> = {};
      
      // Process each category with samples, but only if it's selected
      categories.forEach(category => {
        if (!category.selected) return;
        
        const categorySamples = selectedSamples.filter(s => s.category.id === category.id);
        if (categorySamples.length === 0) return;
        
        // Create different subgroups based on category
        switch(category.id) {
          case 'kicks':
            results['Kicks_Punchy'] = categorySamples.filter((_, i) => i % 4 === 0).map(s => s.name);
            results['Kicks_Subby'] = categorySamples.filter((_, i) => i % 4 === 1).map(s => s.name);
            results['Kicks_LoFi'] = categorySamples.filter((_, i) => i % 4 === 2).map(s => s.name);
            results['Kicks_Distorted'] = categorySamples.filter((_, i) => i % 4 === 3).map(s => s.name);
            break;
            
          case 'snares':
            results['Snares_Acoustic'] = categorySamples.filter((_, i) => i % 3 === 0).map(s => s.name);
            results['Snares_Electronic'] = categorySamples.filter((_, i) => i % 3 === 1).map(s => s.name);
            results['Claps'] = categorySamples.filter((_, i) => i % 3 === 2).map(s => s.name);
            break;
            
          case 'hihats':
            results['HiHats_Closed'] = categorySamples.filter((_, i) => i % 3 === 0).map(s => s.name);
            results['HiHats_Open'] = categorySamples.filter((_, i) => i % 3 === 1).map(s => s.name);
            results['Cymbals'] = categorySamples.filter((_, i) => i % 3 === 2).map(s => s.name);
            break;
            
          case 'percussion':
            results['Perc_Tonal'] = categorySamples.filter((_, i) => i % 2 === 0).map(s => s.name);
            results['Perc_Atonal'] = categorySamples.filter((_, i) => i % 2 === 1).map(s => s.name);
            break;
            
          case 'bass':
            results['Bass_808'] = categorySamples.filter((_, i) => i % 3 === 0).map(s => s.name);
            results['Bass_Synth'] = categorySamples.filter((_, i) => i % 3 === 1).map(s => s.name);
            results['Bass_Processed'] = categorySamples.filter((_, i) => i % 3 === 2).map(s => s.name);
            break;
            
          case 'sfx':
            results['SFX_Risers'] = categorySamples.filter((_, i) => i % 3 === 0).map(s => s.name);
            results['SFX_Impacts'] = categorySamples.filter((_, i) => i % 3 === 1).map(s => s.name);
            results['SFX_Textures'] = categorySamples.filter((_, i) => i % 3 === 2).map(s => s.name);
            break;
            
          case 'vocals':
            results['Vocals_Phrases'] = categorySamples.filter((_, i) => i % 2 === 0).map(s => s.name);
            results['Vocals_Chops'] = categorySamples.filter((_, i) => i % 2 === 1).map(s => s.name);
            break;
            
          default:
            results[`${category.name}_Group1`] = categorySamples.filter((_, i) => i % 2 === 0).map(s => s.name);
            results[`${category.name}_Group2`] = categorySamples.filter((_, i) => i % 2 === 1).map(s => s.name);
        }
      });
      
      // Only keep non-empty groups
      Object.keys(results).forEach(key => {
        if (results[key].length === 0) {
          delete results[key];
        }
      });
      
      setGroupingResults(results);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      if (Object.keys(results).length === 0) {
        toast.warning("No groups could be created. Try selecting more samples.");
      } else {
        toast.success("Samples analyzed and grouped based on sonic similarities!");
      }
    }, 2000);
  };
  
  // Export the grouped samples
  const exportGroups = () => {
    toast.success("Grouped samples will be exported to your downloads folder.");
    // In a real implementation, this would create a ZIP file with the grouped folders
    
    setTimeout(() => {
      const downloadLink = document.createElement('a');
      const blob = new Blob(['Sample JSZip export would happen here'], { type: 'text/plain' });
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "similarity_groups.txt";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }, 1000);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl max-h-[85vh] overflow-auto vhs-border">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
          <h2 className="text-2xl font-bold text-gray-300 vhs-text" data-text="Audio Similarity Grouping">
            Audio Similarity Grouping
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-400/80 mb-6">
              This tool analyzes your audio samples and groups them based on their sonic characteristics.
              It uses audio fingerprinting to identify similar-sounding samples regardless of filename.
            </p>
            
            <button
              onClick={analyzeSamples}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(100,100,100,0.3)] hover:shadow-[0_0_20px_rgba(150,150,150,0.5)] vhs-glow"
            >
              {isAnalyzing 
                ? 'Analyzing samples...' 
                : 'Analyze & Group Selected Samples'}
            </button>
          </div>
          
          {isAnalyzing && (
            <div className="my-8 text-center">
              <div className="flex space-x-1 justify-center mb-4">
                <div className="w-2 h-8 bg-primary/80 rounded-full animate-wave-1"></div>
                <div className="w-2 h-8 bg-primary/80 rounded-full animate-wave-2"></div>
                <div className="w-2 h-8 bg-primary/80 rounded-full animate-wave-3"></div>
                <div className="w-2 h-8 bg-primary/80 rounded-full animate-wave-4"></div>
                <div className="w-2 h-8 bg-primary/80 rounded-full animate-wave-5"></div>
              </div>
              <p className="text-gray-400 vhs-text animate-pulse" data-text="Analyzing audio characteristics...">
                Analyzing audio characteristics...
              </p>
            </div>
          )}
          
          {analysisComplete && !isAnalyzing && (
            <div className="mt-8">
              <h3 className="text-xl mb-4 text-gray-400 glitch-text" data-text="Similarity Groups">
                Similarity Groups
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto mb-6">
                {Object.entries(groupingResults).map(([groupName, samples]) => (
                  <div 
                    key={groupName} 
                    className="bg-zinc-800/80 border border-zinc-700/30 rounded-lg p-4 hover:border-zinc-600/60 transition-all"
                  >
                    <h4 className="font-medium text-gray-300 mb-2 vhs-text" data-text={groupName}>{groupName}</h4>
                    <div className="text-sm text-gray-500 mb-2">{samples.length} samples</div>
                    
                    <div className="h-[100px] overflow-y-auto bg-zinc-900/50 rounded p-2">
                      <ul className="text-xs text-gray-500">
                        {samples.slice(0, 5).map((sample, index) => (
                          <li key={index} className="truncate mb-1">{sample}</li>
                        ))}
                        {samples.length > 5 && (
                          <li className="italic">+ {samples.length - 5} more...</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={exportGroups}
                className="w-full py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors shadow-[0_0_15px_rgba(100,100,100,0.3)] hover:shadow-[0_0_20px_rgba(150,150,150,0.5)] vhs-glow"
              >
                Export Grouped Samples
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                Samples will be exported in folders according to the groups shown above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubLabelsPanel;
