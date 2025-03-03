
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Sample, SampleCategory, SampleContextType } from '@/types/sample';
import { defaultCategories } from '@/utils/sampleUtils';
import { useSampleAnalyzer } from '@/hooks/useSampleAnalyzer';
import { useExportSamples } from '@/hooks/useExportSamples';

// Create the context with a default value
const SampleContext = createContext<SampleContextType>({
  samples: [],
  categories: [],
  isAnalyzing: false,
  isExporting: false,
  analyzedCount: 0,
  totalSamples: 0,
  selectedSamplesCount: 0,
  showSubLabelsPanel: false,
  setShowSubLabelsPanel: () => {},
  getFilteredSamples: () => [],
  currentlyPlayingSample: null,
  addSamples: () => {},
  toggleCategory: () => {},
  selectAllCategories: () => {},
  unselectAllCategories: () => {},
  playSample: () => {},
  stopSample: () => {},
  exportSamples: () => {},
  resetAll: () => {},
  getCategoryCount: () => 0,
});

export const useSampleContext = () => {
  const context = useContext(SampleContext);
  return context;
};

export { type Sample, type SampleCategory } from '@/types/sample';

export const SampleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [categories, setCategories] = useState<SampleCategory[]>(defaultCategories);
  const [currentlyPlayingSample, setCurrentlyPlayingSample] = useState<string | null>(null);
  const [showSubLabelsPanel, setShowSubLabelsPanel] = useState(false);

  // Use our custom hooks
  const { isAnalyzing, analyzedCount, totalSamples, addSamples } = useSampleAnalyzer(
    categories, 
    setSamples, 
    setCategories
  );
  
  const { isExporting, exportSamples: exportSamplesHook } = useExportSamples();

  // Persistent state management for panel
  const handleShowSubLabelsPanel = useCallback((show: boolean) => {
    // Only set if there's an actual change to prevent unnecessary re-renders
    setShowSubLabelsPanel(prevState => {
      if (prevState !== show) {
        return show;
      }
      return prevState;
    });
  }, []);

  // Filtering samples
  const getFilteredSamples = useCallback(() => {
    return samples.filter(sample => 
      categories.find(cat => cat.id === sample.category.id)?.selected
    );
  }, [samples, categories]);

  const getCategoryCount = useCallback((categoryId: string) => {
    return samples.filter(sample => sample.category.id === categoryId).length;
  }, [samples]);

  // Category management
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

  // Audio playback
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

  // Export samples wrapper
  const exportSamples = useCallback(async () => {
    await exportSamplesHook(samples, categories);
  }, [exportSamplesHook, samples, categories]);

  // Reset all state
  const resetAll = useCallback(() => {
    setSamples([]);
    setCategories(prev =>
      prev.map(category => ({ ...category, count: 0, selected: false }))
    );
    setCurrentlyPlayingSample(null);
    setShowSubLabelsPanel(false);
  }, []);

  // Selected samples count
  const selectedSamplesCount = useMemo(() => {
    return getFilteredSamples().length;
  }, [getFilteredSamples]);

  const value: SampleContextType = {
    samples,
    categories,
    isAnalyzing,
    isExporting,
    analyzedCount,
    totalSamples,
    selectedSamplesCount,
    showSubLabelsPanel,
    setShowSubLabelsPanel: handleShowSubLabelsPanel,
    getFilteredSamples,
    currentlyPlayingSample,
    addSamples,
    toggleCategory,
    selectAllCategories,
    unselectAllCategories,
    playSample,
    stopSample,
    exportSamples,
    resetAll,
    getCategoryCount,
  };

  return <SampleContext.Provider value={value}>{children}</SampleContext.Provider>;
};
