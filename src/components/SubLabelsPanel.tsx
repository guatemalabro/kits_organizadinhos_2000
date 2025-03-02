
import React, { useState, useEffect } from 'react';
import { useSampleContext } from '@/context/SampleContext';
import { toast } from 'sonner';

const SubLabelsPanel: React.FC = () => {
  const { samples, categories, showSubLabelsPanel, setShowSubLabelsPanel } = useSampleContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [groupingResults, setGroupingResults] = useState<Record<string, string[]>>({});
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  
  // Automatically analyze samples when panel opens
  useEffect(() => {
    if (showSubLabelsPanel && samples.length > 0) {
      analyzeSamples();
    }
  }, [showSubLabelsPanel]);
  
  // Generate subgroups based on sonic characteristics
  const analyzeSamples = () => {
    if (samples.length === 0) {
      toast.error("No samples to analyze. Please upload some audio files first.");
      return;
    }
    
    setIsAnalyzing(true);
    setGroupingResults({});
    setSelectedGroup(null);
    
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
      
      if (Object.keys(results).length === 0) {
        toast.warning("No groups could be created. Try uploading more samples.");
      } else {
        toast.success("Samples analyzed and grouped successfully!");
        // Set the first group as selected by default
        setSelectedGroup(Object.keys(results)[0]);
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
  
  if (!showSubLabelsPanel) return null;
  
  const groupNames = Object.keys(groupingResults);
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden vhs-border shadow-xl">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
          <h2 className="text-2xl font-bold text-orange-400 vhs-text" data-text="Audio Similarity Analysis">
            Audio Similarity Analysis
          </h2>
          <button 
            onClick={() => setShowSubLabelsPanel(false)}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(90vh-74px)]">
          {/* Left sidebar - Group list */}
          <div className="bg-zinc-950/50 border-r border-zinc-800 overflow-y-auto p-4">
            <h3 className="text-lg font-medium text-orange-300 mb-4">Similarity Groups</h3>
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-48">
                <div className="flex space-x-1 justify-center mb-4">
                  <div className="w-2 h-8 bg-orange-500/80 rounded-full animate-wave-1"></div>
                  <div className="w-2 h-8 bg-orange-500/80 rounded-full animate-wave-2"></div>
                  <div className="w-2 h-8 bg-orange-500/80 rounded-full animate-wave-3"></div>
                  <div className="w-2 h-8 bg-orange-500/80 rounded-full animate-wave-4"></div>
                  <div className="w-2 h-8 bg-orange-500/80 rounded-full animate-wave-5"></div>
                </div>
                <p className="text-gray-400 vhs-text animate-pulse" data-text="Analyzing audio characteristics...">
                  Analyzing audio characteristics...
                </p>
              </div>
            ) : groupNames.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No groups available.</p>
                <button 
                  onClick={analyzeSamples}
                  className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm text-gray-300"
                >
                  Run Analysis
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {groupNames.map((groupName) => (
                  <button
                    key={groupName}
                    onClick={() => setSelectedGroup(groupName)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedGroup === groupName 
                        ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300' 
                        : 'hover:bg-zinc-800/50 border border-zinc-800/40 text-gray-400'
                    }`}
                  >
                    <div className="font-medium">{groupName}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {groupingResults[groupName]?.length || 0} samples
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Right content area - Sample details */}
          <div className="col-span-2 overflow-y-auto p-6">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-400 text-lg">Analyzing samples...</p>
                <p className="text-gray-500 mt-2 text-sm">This may take a moment</p>
              </div>
            ) : selectedGroup ? (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-orange-300 mb-2">{selectedGroup}</h3>
                  <p className="text-gray-400">
                    {groupingResults[selectedGroup]?.length} samples with similar sonic characteristics
                  </p>
                </div>
                
                <div className="bg-zinc-800/50 rounded-lg border border-zinc-700/30 p-4 mb-6">
                  <h4 className="text-md font-medium text-gray-300 mb-3">Samples in this group</h4>
                  
                  <div className="overflow-y-auto max-h-[300px] pr-2">
                    <table className="w-full">
                      <thead className="border-b border-zinc-700/50">
                        <tr>
                          <th className="text-left text-xs text-gray-500 pb-2 w-12">#</th>
                          <th className="text-left text-xs text-gray-500 pb-2">Sample Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupingResults[selectedGroup]?.map((sampleName, index) => (
                          <tr key={index} className="border-b border-zinc-700/20 hover:bg-zinc-700/20">
                            <td className="py-2 text-gray-500 text-sm">{index + 1}</td>
                            <td className="py-2 text-gray-300">{sampleName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-4 mt-6">
                  <button
                    onClick={exportGroups}
                    className="w-full py-3 rounded-lg bg-orange-600/80 hover:bg-orange-500/80 text-white font-medium transition-colors border border-orange-500/30 hover:border-orange-400/60 shadow-md hover:shadow-lg"
                  >
                    Export All Grouped Samples
                  </button>
                  
                  <button
                    onClick={() => analyzeSamples()}
                    className="w-full py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-medium transition-colors"
                  >
                    Re-analyze Samples
                  </button>
                </div>
              </>
            ) : !isAnalyzing && groupNames.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mb-4">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <h3 className="text-xl font-medium text-gray-400 mb-2">No Analysis Results</h3>
                <p className="text-gray-500 max-w-md mb-6">
                  Upload audio samples and run the analysis to group them by sonic characteristics.
                </p>
                <button
                  onClick={analyzeSamples}
                  className="px-6 py-3 rounded-lg bg-orange-600/80 hover:bg-orange-500/80 text-white font-medium transition-colors"
                >
                  Start Analysis
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-gray-400">Select a group from the sidebar to view samples</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubLabelsPanel;
