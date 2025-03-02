
import React, { useState, useEffect, useRef } from 'react';
import { useSampleContext } from '@/context/SampleContext';
import { toast } from 'sonner';
import PanelHeader from './SubLabels/PanelHeader';
import AnalyzerLoading from './SubLabels/AnalyzerLoading';
import GroupList from './SubLabels/GroupList';
import GroupDetailView from './SubLabels/GroupDetailView';
import EmptyState from './SubLabels/EmptyState';
import { analyzeAudioSamples, exportSampleGroups } from './SubLabels/AnalyzerLogic';

const SubLabelsPanel: React.FC = () => {
  const { samples, categories, showSubLabelsPanel, setShowSubLabelsPanel } = useSampleContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [groupingResults, setGroupingResults] = useState<Record<string, string[]>>({});
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Automatically analyze samples when panel opens
  useEffect(() => {
    if (showSubLabelsPanel && samples.length > 0 && Object.keys(groupingResults).length === 0) {
      analyzeSamples();
    }
    
    // Add event listener to handle clicks outside
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
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
  }, [showSubLabelsPanel, samples, setShowSubLabelsPanel, groupingResults]);
  
  // Analyze samples wrapper function
  const analyzeSamples = () => {
    analyzeAudioSamples(
      samples,
      categories,
      setIsAnalyzing,
      setGroupingResults,
      setSelectedGroup
    );
  };
  
  // Export wrapper function
  const exportGroups = () => {
    if (selectedGroup && groupingResults[selectedGroup]) {
      toast.info(`Exporting group: ${selectedGroup}`);
      exportSampleGroups(selectedGroup, groupingResults[selectedGroup], samples);
    } else {
      toast.error("Please select a group to export");
    }
  };
  
  if (!showSubLabelsPanel) return null;
  
  const groupNames = Object.keys(groupingResults);
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      // Removed the onClick handler here to prevent panel closure
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" />
      
      {/* Maximized panel - taking up almost the entire viewport */}
      <div 
        ref={panelRef}
        className="fixed inset-1 z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl vhs-border flex flex-col"
        // Removed the onClick handler here to prevent panel closure
      >
        <PanelHeader handleCloseClick={handleCloseClick} />
        
        <div className="flex flex-col md:flex-row h-[calc(100%-5.5rem)] overflow-hidden">
          {/* Left sidebar - Group list - Made wider */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-zinc-950/50 border-r border-zinc-800 overflow-y-auto p-5 md:p-6 h-1/3 md:h-full">
            <h3 className="text-xl font-medium text-orange-300 mb-5">Similarity Groups</h3>
            
            {isAnalyzing ? (
              <AnalyzerLoading />
            ) : (
              <GroupList 
                groupNames={groupNames}
                groupingResults={groupingResults}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                analyzeSamples={analyzeSamples}
                categories={categories}
              />
            )}
          </div>
          
          {/* Right content area - Sample details */}
          <div className="flex-1 overflow-y-auto p-5 md:p-8 h-2/3 md:h-full">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-400 text-xl">Analyzing samples...</p>
                <p className="text-gray-500 mt-2 text-base">This may take a moment</p>
              </div>
            ) : selectedGroup ? (
              <GroupDetailView 
                selectedGroup={selectedGroup}
                groupingResults={groupingResults}
                exportGroups={exportGroups}
                analyzeSamples={analyzeSamples}
              />
            ) : !isAnalyzing && groupNames.length === 0 ? (
              <EmptyState 
                analyzeSamples={analyzeSamples}
                categories={categories}
                setShowSubLabelsPanel={setShowSubLabelsPanel}
              />
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
