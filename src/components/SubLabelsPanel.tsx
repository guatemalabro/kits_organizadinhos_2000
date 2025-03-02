
import React, { useState, useEffect, useRef } from 'react';
import { useSampleContext } from '@/context/SampleContext';
import { toast } from 'sonner';

const SubLabelsPanel: React.FC = () => {
  const { samples, categories, showSubLabelsPanel, setShowSubLabelsPanel } = useSampleContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [groupingResults, setGroupingResults] = useState<Record<string, string[]>>({});
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Automatically analyze samples when panel opens
  useEffect(() => {
    if (showSubLabelsPanel && samples.length > 0) {
      analyzeSamples();
    }
    
    // Add event listener to handle clicks outside
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        // Only close if we click outside
        setShowSubLabelsPanel(false);
      }
    };
    
    // Add global click listener when panel is open
    if (showSubLabelsPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSubLabelsPanel, samples, setShowSubLabelsPanel]);
  
  // Generate subgroups based on sonic characteristics, but only for selected categories
  const analyzeSamples = () => {
    if (samples.length === 0) {
      toast.error("No samples to analyze. Please upload some audio files first.");
      return;
    }
    
    // Get selected categories first
    const selectedCategories = categories.filter(cat => cat.selected);
    
    // If no categories are selected, show a message and return early
    if (selectedCategories.length === 0) {
      toast.warning("No categories selected. Please select at least one category for analysis.");
      return;
    }
    
    setIsAnalyzing(true);
    setGroupingResults({});
    setSelectedGroup(null);
    
    // Simulate processing time
    setTimeout(() => {
      const results: Record<string, string[]> = {};
      
      // Group samples by category first, but only for selected categories
      const samplesByCategory: Record<string, any[]> = {};
      
      samples.forEach(sample => {
        const categoryId = sample.category.id;
        // Only include samples from selected categories
        if (selectedCategories.some(cat => cat.id === categoryId)) {
          if (!samplesByCategory[categoryId]) {
            samplesByCategory[categoryId] = [];
          }
          samplesByCategory[categoryId].push(sample);
        }
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
        toast.warning("No groups could be created. Try uploading more samples or selecting different categories.");
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
  
  // Prevent event propagation for closing when clicking inside the panel
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleCloseClick = () => {
    setShowSubLabelsPanel(false);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden" onClick={handleContainerClick}>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" />
      
      {/* Maximized panel - taking up almost the entire viewport */}
      <div 
        ref={panelRef}
        className="fixed inset-1 z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl vhs-border flex flex-col"
        onClick={handleContainerClick}
      >
        <div className="p-5 md:p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-400 vhs-text" data-text="Audio Similarity Analysis">
            Audio Similarity Analysis
          </h2>
          <button 
            onClick={handleCloseClick}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row h-[calc(100%-5.5rem)] overflow-hidden">
          {/* Left sidebar - Group list - Made wider */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-zinc-950/50 border-r border-zinc-800 overflow-y-auto p-5 md:p-6 h-1/3 md:h-full">
            <h3 className="text-xl font-medium text-orange-300 mb-5">Similarity Groups</h3>
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-48">
                <div className="flex space-x-2 justify-center mb-6">
                  <div className="w-3 h-10 bg-orange-500/80 rounded-full animate-wave-1"></div>
                  <div className="w-3 h-10 bg-orange-500/80 rounded-full animate-wave-2"></div>
                  <div className="w-3 h-10 bg-orange-500/80 rounded-full animate-wave-3"></div>
                  <div className="w-3 h-10 bg-orange-500/80 rounded-full animate-wave-4"></div>
                  <div className="w-3 h-10 bg-orange-500/80 rounded-full animate-wave-5"></div>
                </div>
                <p className="text-gray-400 vhs-text animate-pulse" data-text="Analyzing audio characteristics...">
                  Analyzing audio characteristics...
                </p>
              </div>
            ) : groupNames.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No groups available.</p>
                <p className="mt-2 text-sm text-gray-400">
                  {categories.some(cat => cat.selected) 
                    ? "Try selecting different categories or upload more samples." 
                    : "Please select at least one category to analyze."}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    analyzeSamples();
                  }}
                  className="mt-4 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm text-gray-300"
                >
                  Run Analysis
                </button>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-20rem)] md:max-h-[calc(100vh-15rem)] pr-2">
                {groupNames.map((groupName) => (
                  <button
                    key={groupName}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGroup(groupName);
                    }}
                    className={`w-full text-left p-4 rounded-md transition-colors cursor-pointer ${
                      selectedGroup === groupName 
                        ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300' 
                        : 'hover:bg-zinc-800/50 border border-zinc-800/40 text-gray-400'
                    }`}
                  >
                    <div className="font-medium text-lg">{groupName}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {groupingResults[groupName]?.length || 0} samples
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Right content area - Sample details - Increased padding and font sizes */}
          <div className="flex-1 overflow-y-auto p-5 md:p-8 h-2/3 md:h-full">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-400 text-xl">Analyzing samples...</p>
                <p className="text-gray-500 mt-2 text-base">This may take a moment</p>
              </div>
            ) : selectedGroup ? (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-medium text-orange-300 mb-4">{selectedGroup}</h3>
                  <p className="text-gray-400 text-lg">
                    {groupingResults[selectedGroup]?.length} samples with similar sonic characteristics
                  </p>
                </div>
                
                <div className="bg-zinc-800/50 rounded-lg border border-zinc-700/30 p-6 md:p-8 mb-8">
                  <h4 className="text-xl font-medium text-gray-300 mb-6">Samples in this group</h4>
                  
                  <div className="overflow-y-auto max-h-[40vh] md:max-h-[50vh] pr-2">
                    <table className="w-full">
                      <thead className="border-b border-zinc-700/50 sticky top-0 bg-zinc-800/90 z-10">
                        <tr>
                          <th className="text-left text-sm font-medium text-gray-500 p-4 w-16">#</th>
                          <th className="text-left text-sm font-medium text-gray-500 p-4">Sample Name</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/30">
                        {groupingResults[selectedGroup]?.map((sampleName, index) => (
                          <tr 
                            key={index} 
                            className="hover:bg-zinc-700/20 group cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              // In a real app, this would play the sample
                              toast.info(`Playing sample: ${sampleName}`);
                            }}
                          >
                            <td className="py-4 px-4 text-gray-500 text-base">{index + 1}</td>
                            <td className="py-4 px-4 text-gray-300 text-lg group-hover:text-orange-300 transition-colors">{sampleName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-4 mt-8">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      exportGroups();
                    }}
                    className="w-full py-5 md:py-6 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xl font-medium transition-colors border border-orange-500/30 hover:border-orange-400/60 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    Export All Grouped Samples
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      analyzeSamples();
                    }}
                    className="w-full py-4 md:py-5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700/50"
                  >
                    Re-analyze Samples
                  </button>
                </div>
              </>
            ) : !isAnalyzing && groupNames.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mb-6">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <h3 className="text-2xl font-medium text-gray-400 mb-3">No Analysis Results</h3>
                <p className="text-gray-500 text-lg max-w-lg mb-4">
                  {categories.some(cat => cat.selected) 
                    ? "Upload audio samples and run the analysis to group them by sonic characteristics."
                    : "Please select at least one category before running the analysis."}
                </p>
                {!categories.some(cat => cat.selected) && (
                  <p className="text-orange-400 text-base mb-6">
                    Go back to the main screen and select some categories first.
                  </p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (categories.some(cat => cat.selected)) {
                      analyzeSamples();
                    } else {
                      toast.warning("Please select at least one category first");
                      setShowSubLabelsPanel(false);
                    }
                  }}
                  className="px-8 py-4 rounded-lg bg-orange-600/80 hover:bg-orange-500/80 text-white text-lg font-medium transition-colors"
                >
                  {categories.some(cat => cat.selected) ? "Start Analysis" : "Go Back and Select Categories"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-gray-400 text-xl">Select a group from the sidebar to view samples</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubLabelsPanel;
