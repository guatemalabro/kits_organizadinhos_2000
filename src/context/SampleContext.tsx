
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import JSZip from 'jszip';

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
  getFilteredSamples: () => Sample[];
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

  // Get filtered samples based on selected categories
  const getFilteredSamples = useCallback(() => {
    return samples.filter(sample => 
      categories.find(cat => cat.id === sample.category.id)?.selected
    );
  }, [samples, categories]);

  // Improved sample analysis with more accurate categorization
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
      
      // More intelligent category assignment based on filename patterns
      const fileName = file.name.toLowerCase();
      let categoryId = 'other';
      
      // Assign categories based on common naming patterns
      if (/(^|\W)(kick|bd|bass\s*drum)(\W|$)/.test(fileName)) {
        categoryId = 'kicks';
      } else if (/(^|\W)(snare|clap|rim|sd)(\W|$)/.test(fileName)) {
        categoryId = 'snares';
      } else if (/(^|\W)(hat|hh|hi|hihat|cymbal)(\W|$)/.test(fileName)) {
        categoryId = 'hihats';
      } else if (/(^|\W)(tom|perc|conga|bongo|tamb|shaker|block)(\W|$)/.test(fileName)) {
        categoryId = 'percussion';
      } else if (/(^|\W)(bass|sub|808)(\W|$)/.test(fileName) && !/(^|\W)(drum)(\W|$)/.test(fileName)) {
        categoryId = 'bass';
      } else if (/(^|\W)(fx|riser|down|sweep|impact|whoosh|sfx)(\W|$)/.test(fileName)) {
        categoryId = 'sfx';
      } else if (/(^|\W)(vox|vocal|voice|speak|talk|sing)(\W|$)/.test(fileName)) {
        categoryId = 'vocals';
      }
      
      // Get matching category
      const category = tempCategories.find(cat => cat.id === categoryId)!;
      
      // Increment category count
      const categoryIndex = tempCategories.findIndex(cat => cat.id === categoryId);
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

  const exportSamples = useCallback(async () => {
    setIsExporting(true);
    
    try {
      // Create a new zip file
      const zip = new JSZip();
      
      // Get selected categories
      const selectedCategoryIds = categories
        .filter(cat => cat.selected)
        .map(cat => cat.id);
      
      // Filter samples by selected categories
      const selectedSamples = samples.filter(sample => 
        selectedCategoryIds.includes(sample.category.id)
      );
      
      // Group samples by category
      const samplesByCategory: Record<string, Sample[]> = {};
      
      selectedSamples.forEach(sample => {
        const categoryName = sample.category.name;
        if (!samplesByCategory[categoryName]) {
          samplesByCategory[categoryName] = [];
        }
        samplesByCategory[categoryName].push(sample);
      });
      
      // Add files to zip, organized by category folders
      const fetchPromises: Promise<void>[] = [];
      
      Object.entries(samplesByCategory).forEach(([categoryName, categorySamples]) => {
        categorySamples.forEach(sample => {
          const fetchPromise = fetch(sample.path)
            .then(response => response.blob())
            .then(blob => {
              // Create folder structure and add file
              const folderPath = categoryName.replace(/[/\\?%*:|"<>]/g, '_');
              const fileName = sample.name;
              zip.folder(folderPath)?.file(fileName, blob);
            });
          
          fetchPromises.push(fetchPromise);
        });
      });
      
      // Wait for all fetch operations to complete
      await Promise.all(fetchPromises);
      
      // Generate the ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Create a download link and trigger download
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = `samples_export_${new Date().toISOString().slice(0, 10)}.zip`;
      downloadLink.click();
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(downloadLink.href);
      }, 100);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      // In a real application, you would show an error toast here
    } finally {
      setIsExporting(false);
    }
  }, [categories, samples]);

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

  // Get the accurate count of samples that will be exported
  const selectedSamplesCount = useMemo(() => {
    return getFilteredSamples().length;
  }, [getFilteredSamples]);

  const value = {
    samples,
    categories,
    isAnalyzing,
    isExporting,
    analyzedCount,
    totalSamples,
    selectedSamplesCount,
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
  };

  return <SampleContext.Provider value={value}>{children}</SampleContext.Provider>;
};
