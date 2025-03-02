
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface Sample {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  lastModified: number;
  category: SampleCategory;
  duration?: number;
  waveform?: number[];
  bpm?: number;
  key?: string;
  isPlaying?: boolean;
}

export interface SampleCategory {
  id: string;
  name: string;
  count: number;
  selected: boolean;
}

interface SampleContextType {
  samples: Sample[];
  categories: SampleCategory[];
  isAnalyzing: boolean;
  isExporting: boolean;
  analyzedCount: number;
  totalSamples: number;
  selectedSamplesCount: number;
  currentlyPlayingSample: string | null;
  addSamples: (files: File[]) => void;
  toggleCategory: (categoryId: string) => void;
  selectAllCategories: () => void;
  unselectAllCategories: () => void;
  playSample: (sampleId: string) => void;
  stopSample: () => void;
  exportSamples: () => void;
  resetAll: () => void;
}

const SampleContext = createContext<SampleContextType | undefined>(undefined);

export const useSampleContext = () => {
  const context = useContext(SampleContext);
  if (!context) {
    throw new Error('useSampleContext must be used within a SampleProvider');
  }
  return context;
};

export const SampleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [categories, setCategories] = useState<SampleCategory[]>([
    { id: 'kicks', name: 'Kicks', count: 0, selected: true },
    { id: 'snares', name: 'Snares/Claps', count: 0, selected: true },
    { id: 'hihats', name: 'Hi-Hats', count: 0, selected: true },
    { id: 'percussion', name: 'Percussion', count: 0, selected: true },
    { id: 'bass', name: 'Bass', count: 0, selected: true },
    { id: 'sfx', name: 'SFX', count: 0, selected: true },
    { id: 'vocals', name: 'Vocals', count: 0, selected: true },
    { id: 'other', name: 'Other', count: 0, selected: true },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [analyzedCount, setAnalyzedCount] = useState(0);
  const [totalSamples, setTotalSamples] = useState(0);
  const [currentlyPlayingSample, setCurrentlyPlayingSample] = useState<string | null>(null);

  // Mock function to analyze samples (in a real app, you'd use ML classification)
  const analyzeSamples = useCallback(async (files: File[]) => {
    setIsAnalyzing(true);
    setTotalSamples(files.length);
    setAnalyzedCount(0);
    
    const newSamples: Sample[] = [];
    const tempCategories = [...categories];
    
    // Reset category counts
    tempCategories.forEach(cat => {
      cat.count = 0;
    });
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Assign random category for demo (in a real app, this would be ML-based)
      const categoryIndex = Math.floor(Math.random() * categories.length);
      const category = tempCategories[categoryIndex];
      
      // Increment category count
      tempCategories[categoryIndex].count++;
      
      const newSample: Sample = {
        id: `sample-${Date.now()}-${i}`,
        name: file.name,
        path: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        category: category,
        waveform: Array.from({ length: 50 }, () => Math.random()),
        duration: Math.random() * 5,
        bpm: Math.floor(Math.random() * 40) + 80,
        key: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][Math.floor(Math.random() * 12)],
      };
      
      newSamples.push(newSample);
      setAnalyzedCount(i + 1);
    }
    
    setSamples(prev => [...prev, ...newSamples]);
    setCategories(tempCategories);
    setIsAnalyzing(false);
  }, [categories]);

  const addSamples = useCallback((files: File[]) => {
    analyzeSamples(files);
  }, [analyzeSamples]);

  const toggleCategory = useCallback((categoryId: string) => {
    setCategories(prev =>
      prev.map(category =>
        category.id === categoryId
          ? { ...category, selected: !category.selected }
          : category
      )
    );
  }, []);

  const selectAllCategories = useCallback(() => {
    setCategories(prev =>
      prev.map(category => ({ ...category, selected: true }))
    );
  }, []);

  const unselectAllCategories = useCallback(() => {
    setCategories(prev =>
      prev.map(category => ({ ...category, selected: false }))
    );
  }, []);

  const playSample = useCallback((sampleId: string) => {
    setCurrentlyPlayingSample(sampleId);
    setSamples(prev =>
      prev.map(sample => ({
        ...sample,
        isPlaying: sample.id === sampleId
      }))
    );
  }, []);

  const stopSample = useCallback(() => {
    setCurrentlyPlayingSample(null);
    setSamples(prev =>
      prev.map(sample => ({
        ...sample,
        isPlaying: false
      }))
    );
  }, []);

  const exportSamples = useCallback(() => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      // In a real app, you would create and download a zip file here
      alert('Samples exported successfully! (In a real app, this would download a zip file)');
    }, 2000);
  }, []);

  const resetAll = useCallback(() => {
    setSamples([]);
    setCategories(prev =>
      prev.map(category => ({ ...category, count: 0, selected: true }))
    );
    setAnalyzedCount(0);
    setTotalSamples(0);
    setIsAnalyzing(false);
    setIsExporting(false);
    setCurrentlyPlayingSample(null);
  }, []);

  const selectedSamplesCount = categories
    .filter(cat => cat.selected)
    .reduce((acc, cat) => acc + cat.count, 0);

  const value = {
    samples,
    categories,
    isAnalyzing,
    isExporting,
    analyzedCount,
    totalSamples,
    selectedSamplesCount,
    currentlyPlayingSample,
    addSamples,
    toggleCategory,
    selectAllCategories,
    unselectAllCategories,
    playSample,
    stopSample,
    exportSamples,
    resetAll,
  };

  return <SampleContext.Provider value={value}>{children}</SampleContext.Provider>;
};
