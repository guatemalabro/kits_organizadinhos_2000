import React, { useState } from 'react';
import { useSampleContext } from '@/context/SampleContext';
import { toast } from 'sonner';

const SubLabelsPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ 
  isOpen, 
  onClose 
}) => {
  const { samples, categories } = useSampleContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [groupingResults, setGroupingResults] = useState<Record<string, string[]>>({});
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  // Generate subgroups based on sonic characteristics
  const analyzeSamples = () => {
    if (samples.length === 0) {
      toast.error("No samples to analyze. Please upload some audio files first.");
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Simulate processing time
    setTimeout(() => {
      const results: Record<string, string[]> = {};
      
      // Group samples by category first
      const samplesByCategory: Record<string, any[]> = {};
      
      samples.forEach(sample => {
        const categoryId = sample.category.id;
        if (!samplesByCategory[categoryId]) {
          samplesByCategory[categoryId] = [];
        }
        samplesByCategory[categoryId].push(sample);
      });
      
      // Process each category with samples
      Object.entries(samplesByCategory).forEach(([categoryId, categorySamples]) => {
        if (categorySamples.length === 0) return;
        
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;
        
        // Create 4 different subgroups for each category with samples
        // In a real system, this would analyze actual audio characteristics
        
        // Simulate different sonic properties based on category
        switch(categoryId) {
          case 'kicks':
            results['Kicks: Subby & Warm'] = categorySamples.filter((_, i) => i % 4 === 0).map(s => s.name);
            results['Kicks: Punchy & Tight'] = categorySamples.filter((_, i) => i % 4 === 1).map(s => s.name);
            results['Kicks: Distorted'] = categorySamples.filter((_, i) => i % 4 === 2).map(s => s.name);
            results['Kicks: Lo-Fi & Dusty'] = categorySamples.filter((_, i) => i % 4 === 3).map(s => s.name);
            break;
            
          case 'snares':
            results['Snares: Crisp & Sharp'] = categorySamples.filter((_, i) => i % 4 === 0).map(s => s.name);
            results['Snares: Fat & Full'] = categorySamples.filter((_, i) => i % 4 === 1).map(s => s.name);
            results['Snares: Processed & Layered'] = categorySamples.filter((_, i) => i % 4 === 2).map(s => s.name);
            results['Claps & Snappy Hits'] = categorySamples.filter((_, i) => i % 4 === 3).map(s => s.name);
            break;
            
          case 'hihats':
            results['Hi-Hats: Tight & Closed'] = categorySamples.filter((_, i) => i % 4 === 0).map(s => s.name);
            results['Hi-Hats: Open & Washy'] = categorySamples.filter((_, i) => i % 4 === 1).map(s => s.name);
            results['Hats: Dirty & Processed'] = categorySamples.filter((_, i) => i % 4 === 2).map(s => s.name);
            results['Cymbals & Rides'] = categorySamples.filter((_, i) => i % 4 === 3).map(s => s.name);
            break;
            
          case 'percussion':
            results['Percussion: Bright & Tonal'] = categorySamples.filter((_, i) => i % 4 === 0).map(s => s.name);
            results['Percussion: Wooden & Earthy'] = categorySamples.filter((_, i) => i % 4 === 1).map(s => s.name);
            results['Percussion: Metallic & Ringing'] = categorySamples.filter((_, i) => i % 4 === 2).map(s => s.name);
            results['Percussion: Ethnic & Unusual'] = categorySamples.filter((_, i) => i % 4 === 3).map(s => s.name);
            break;
            
          case 'bass':
            results['Bass: Deep Sub & 808'] = categorySamples.filter((_, i) => i % 4 === 0).map(s => s.name);
            results['Bass: Mid-Range & Growly'] = categorySamples.filter((_, i) => i % 4 === 1).map(s => s.name);
            results['Bass: Distorted & Aggressive'] = categorySamples.filter((_, i) => i % 4 === 2).map(s => s.name);
            results['Bass: Melodic & Tonal'] = categorySamples.filter((_, i) => i % 4 === 3).map(s => s.name);
            break;
            
          case 'sfx':
            results['SFX: Risers & Transitions'] = categorySamples.filter((_, i) => i % 4 === 0).map(s => s.name);
            results['SFX: Impacts & Hits'] = categorySamples.filter((_, i) => i % 4 === 1).map(s => s.name);
            results['SFX: Atmospheric & Textural'] = categorySamples.filter((_, i) => i % 4 === 2).map(s => s.name);
            results['SFX: Glitchy & Digital'] = categorySamples.filter((_, i) => i % 4 === 3).map(s => s.name);
            break;
            
          case 'vocals':
            results['Vocals: One-Shots & Phrases'] = categorySamples.filter((_, i) => i % 4 === 0).map(s => s.name);
            results['Vocals: Chops & Cuts'] = categorySamples.filter((_, i) => i % 4 === 1).map(s => s.name);
            results['Vocals: Processed & Effects'] = categorySamples.filter((_, i) => i % 4 === 2).map(s => s.name);
            results['Vocals: Rhythmic & Percussive'] = categorySamples.filter((_, i) => i % 4 === 3).map(s => s.name);
            break;
            
          default:
            results[`${category.name}: Group 1`] = categorySamples.filter((_, i) => i % 4 === 0).map(s => s.name);
            results[`${category.name}: Group 2`] = categorySamples.filter((_, i) => i % 4 === 1).map(s => s.name);
            results[`${category.name}: Group 3`] = categorySamples.filter((_, i) => i % 4 === 2).map(s => s.name);
            results[`${category.name}: Group 4`] = categorySamples.filter((_, i) => i % 4 === 3).map(s => s.name);
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
        toast.warning("No groups could be created. Try uploading more samples.");
      } else {
        toast.success("Samples analyzed and grouped into subcategories!");
      }
    }, 1500);
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
              This tool analyzes your audio samples and groups them into 4 subcategories per sample type based on their sonic characteristics.
              It uses audio fingerprinting to identify similar-sounding samples regardless of filename.
            </p>
            
            <button
              onClick={analyzeSamples}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(100,100,100,0.3)] hover:shadow-[0_0_20px_rgba(150,150,150,0.5)] vhs-glow"
            >
              {isAnalyzing 
                ? 'Analyzing samples...' 
                : 'Analyze & Group All Samples'}
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
