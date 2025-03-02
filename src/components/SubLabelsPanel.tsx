
import React, { useState } from 'react';
import { useSampleContext } from '@/context/SampleContext';
import { Slider } from '@/components/ui/slider';

const SubLabelsPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ 
  isOpen, 
  onClose 
}) => {
  const { samples, categories } = useSampleContext();
  const [specificityLevel, setSpecificityLevel] = useState(2);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [subLabels, setSubLabels] = useState<Record<string, string[]>>({});
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  const specificityLabels = [
    'Basic', 
    'Standard', 
    'Detailed', 
    'Very Detailed', 
    'Ultra-Detailed'
  ];
  
  // Generate mock sub-labels based on specificityLevel
  const generateSubLabels = () => {
    setIsAnalyzing(true);
    
    // Simulate processing time
    setTimeout(() => {
      const mockSubLabels: Record<string, string[]> = {};
      
      // Create sub-labels for each category based on specificity level
      categories.forEach(category => {
        if (category.count === 0) return;
        
        switch(category.id) {
          case 'kicks':
            if (specificityLevel >= 1) mockSubLabels['Kicks_Punchy'] = ['Sample 1', 'Sample 4'];
            if (specificityLevel >= 2) mockSubLabels['Kicks_Boomy'] = ['Sample 2', 'Sample 7'];
            if (specificityLevel >= 3) mockSubLabels['Kicks_Distorted'] = ['Sample 3'];
            if (specificityLevel >= 4) mockSubLabels['Kicks_Short_Punchy'] = ['Sample 5'];
            if (specificityLevel >= 5) mockSubLabels['Kicks_Lo-Fi_Tape'] = ['Sample 6'];
            break;
          case 'snares':
            if (specificityLevel >= 1) mockSubLabels['Snares_Acoustic'] = ['Sample 8', 'Sample 12'];
            if (specificityLevel >= 2) mockSubLabels['Snares_Electronic'] = ['Sample 9', 'Sample 11'];
            if (specificityLevel >= 3) mockSubLabels['Claps_Tight'] = ['Sample 10'];
            if (specificityLevel >= 4) mockSubLabels['Snares_Rimshot'] = ['Sample 13'];
            if (specificityLevel >= 5) mockSubLabels['Claps_Reverb_Tail'] = ['Sample 14'];
            break;
          case 'hihats':
            if (specificityLevel >= 1) mockSubLabels['HiHats_Closed'] = ['Sample 15', 'Sample 19'];
            if (specificityLevel >= 2) mockSubLabels['HiHats_Open'] = ['Sample 16', 'Sample 18'];
            if (specificityLevel >= 3) mockSubLabels['Cymbals_Crash'] = ['Sample 17'];
            if (specificityLevel >= 4) mockSubLabels['HiHats_Pedal'] = ['Sample 20'];
            if (specificityLevel >= 5) mockSubLabels['Rides_Bell'] = ['Sample 21'];
            break;
          // Add more categories as needed
        }
      });
      
      setSubLabels(mockSubLabels);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2500);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[85vh] overflow-auto vhs-border">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
          <h2 className="text-2xl font-bold text-gray-300 vhs-text" data-text="Advanced Sub-Labels Analysis">
            Advanced Sub-Labels Analysis
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
          <div className="mb-8">
            <h3 className="text-xl mb-4 text-gray-400 glitch-text" data-text="Multi-Layered Audio Fingerprinting">
              Multi-Layered Audio Fingerprinting
            </h3>
            <p className="text-gray-400/80 mb-6">
              Our algorithm analyzes the acoustic properties of your samples using spectral analysis, 
              transient detection, timbre modeling, and ML-based clustering to create meaningful sub-categories.
            </p>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-400 vhs-text" data-text="Specificity Level">
                  Specificity Level
                </label>
                <span className="text-sm text-gray-500">
                  {specificityLabels[specificityLevel - 1]}
                </span>
              </div>
              
              <Slider
                value={[specificityLevel]}
                min={1}
                max={5}
                step={1}
                onValueChange={(value) => setSpecificityLevel(value[0])}
                className="py-4"
              />
              
              <div className="flex justify-between text-xs text-gray-500 px-2">
                <span>Basic Groups</span>
                <span>Ultra-Detailed</span>
              </div>
            </div>
            
            <button
              onClick={generateSubLabels}
              disabled={isAnalyzing || samples.length === 0}
              className="w-full py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_15px_rgba(100,100,100,0.3)] hover:shadow-[0_0_20px_rgba(150,150,150,0.5)] vhs-glow"
            >
              {isAnalyzing 
                ? 'Analyzing acoustic properties...' 
                : samples.length === 0 
                  ? 'Upload samples first' 
                  : 'Analyze Sample Acoustic Properties'}
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
              <p className="text-gray-400 vhs-text animate-pulse" data-text="Analyzing spectral characteristics...">
                Analyzing spectral characteristics...
              </p>
            </div>
          )}
          
          {analysisComplete && !isAnalyzing && (
            <div className="mt-8">
              <h3 className="text-xl mb-4 text-gray-400 glitch-text" data-text="Generated Sub-Labels">
                Generated Sub-Labels
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(subLabels).map(([subLabel, samples]) => (
                  <div 
                    key={subLabel} 
                    className="bg-zinc-800/80 border border-zinc-700/30 rounded-lg p-4 hover:border-zinc-600/60 transition-all"
                  >
                    <h4 className="font-medium text-gray-300 mb-2 vhs-text" data-text={subLabel}>{subLabel}</h4>
                    <div className="text-sm text-gray-500">{samples.length} samples</div>
                    
                    <div className="mt-3">
                      <div className="flex space-x-1 items-center">
                        <div className="w-full bg-zinc-700/50 rounded-full h-1.5">
                          <div 
                            className="bg-green-500/70 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(100, 60 + Math.random() * 40)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {Math.floor(80 + Math.random() * 20)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Confidence score</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 border border-zinc-800 rounded-lg bg-zinc-900/80">
                <h4 className="font-medium text-gray-300 mb-2">Export Options</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 bg-zinc-800 text-sm text-gray-400 rounded-md hover:bg-zinc-700">
                    Export with Sub-Labels
                  </button>
                  <button className="px-3 py-1.5 bg-zinc-800 text-sm text-gray-400 rounded-md hover:bg-zinc-700">
                    Save as Template
                  </button>
                  <button className="px-3 py-1.5 bg-zinc-800 text-sm text-gray-400 rounded-md hover:bg-zinc-700">
                    Embed Metadata
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubLabelsPanel;
