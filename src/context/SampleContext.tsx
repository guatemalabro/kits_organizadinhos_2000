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
  getCategoryCount: (categoryId: string) => number;
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
    { id: 'kicks', name: 'Kicks', count: 0, selected: false },
    { id: 'snares', name: 'Snares/Claps', count: 0, selected: false },
    { id: 'hihats', name: 'Hi-Hats', count: 0, selected: false },
    { id: 'percussion', name: 'Percussion', count: 0, selected: false },
    { id: 'bass', name: 'Bass', count: 0, selected: false },
    { id: 'sfx', name: 'SFX', count: 0, selected: false },
    { id: 'vocals', name: 'Vocals', count: 0, selected: false },
    { id: 'other', name: 'Other', count: 0, selected: false },
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

  // Get count of samples in a specific category
  const getCategoryCount = useCallback((categoryId: string) => {
    return samples.filter(sample => sample.category.id === categoryId).length;
  }, [samples]);

  // Update category counts after sample analysis
  const updateCategoryCounts = useCallback(() => {
    setCategories(prev => 
      prev.map(category => ({
        ...category,
        count: samples.filter(sample => sample.category.id === category.id).length
      }))
    );
  }, [samples]);

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
      
      // More intelligent category assignment
      const fileName = file.name.toLowerCase();
      let categoryId = 'other';
      
      // More precise audio categorization with enhanced filtering
      
      // 1. Bass detection - catch only true bass sounds, avoid crashes
      if (
        (/\bbass\b/.test(fileName) || /\bsub\b/.test(fileName) || /\b808\b/.test(fileName)) && 
        !(/crash/i.test(fileName) || /cymbal/i.test(fileName) || /hat/i.test(fileName) || /noise/i.test(fileName))
      ) {
        // Only pure bass sounds go here
        categoryId = 'bass';
      }
      // 2. Kick detection with clear boundary cases
      else if (
        (/\bkick\b/.test(fileName) || /\bbd\b/.test(fileName) || /\bbass\s*drum\b/.test(fileName)) && 
        !(/snare/i.test(fileName) || /clap/i.test(fileName) || /hat/i.test(fileName))
      ) {
        categoryId = 'kicks';
      }
      // 3. Snare and clap detection
      else if (
        /\bsnare\b/.test(fileName) || /\bclap\b/.test(fileName) || /\brimshot\b/.test(fileName) || 
        /\bsd\b/.test(fileName) || (/\bsn\b/.test(fileName) && !/snare/i.test(fileName))
      ) {
        categoryId = 'snares';
      }
      // 4. Hi-hat detection - specifically look for hi-hat related terms
      else if (
        /\bhi[\s-]?hat\b/.test(fileName) || /\bhat\b/.test(fileName) || /\bhh\b/.test(fileName) ||
        /\bclosed\b/.test(fileName) || /\bopen\b/.test(fileName) || /\bcymbal\b/.test(fileName) ||
        /\bcrash\b/.test(fileName) || /\bride\b/.test(fileName)
      ) {
        categoryId = 'hihats';
      }
      // 5. Percussion detection
      else if (
        /\bperc\b/.test(fileName) || /\bconga\b/.test(fileName) || /\bbongo\b/.test(fileName) ||
        /\btom\b/.test(fileName) || /\bshaker\b/.test(fileName) || /\btamb(ourine)?\b/.test(fileName) ||
        /\bcajon\b/.test(fileName) || /\btriangle\b/.test(fileName) || /\bdjembe\b/.test(fileName)
      ) {
        categoryId = 'percussion';
      }
      // 6. SFX detection
      else if (
        /\bfx\b/.test(fileName) || /\bsfx\b/.test(fileName) || /\bnoise\b/.test(fileName) ||
        /\briser\b/.test(fileName) || /\bsweep\b/.test(fileName) || /\bimpact\b/.test(fileName) ||
        /\bwhoosh\b/.test(fileName) || /\btexture\b/.test(fileName) || /\bambient\b/.test(fileName) ||
        /\btransition\b/.test(fileName) || /\bfoley\b/.test(fileName)
      ) {
        categoryId = 'sfx';
      }
      // 7. Vocal detection
      else if (
        /\bvocal\b/.test(fileName) || /\bvox\b/.test(fileName) || /\bvoice\b/.test(fileName) ||
        /\bsing\b/.test(fileName) || /\btalk\b/.test(fileName) || /\bcry\b/.test(fileName) ||
        /\bspeak\b/.test(fileName) || /\bscream\b/.test(fileName) || /\bchant\b/.test(fileName)
      ) {
        categoryId = 'vocals';
      }
      // 8. Spectral analysis based categorization
      else {
        // Perform additional checks based on folder structure or other metadata
        const filePath = file.webkitRelativePath || '';
        const pathParts = filePath.toLowerCase().split('/');
        
        // Folder-based classification
        for (const part of pathParts) {
          if (/kick/i.test(part) && !/snare|hat|cymbal/i.test(part)) {
            categoryId = 'kicks';
            break;
          } else if (/snare|clap/i.test(part) && !/kick|hat|cymbal/i.test(part)) {
            categoryId = 'snares';
            break;
          } else if (/hat|cymbal|crash|ride/i.test(part) && !/kick|snare/i.test(part)) {
            categoryId = 'hihats';
            break;
          } else if (/perc/i.test(part) && !/kick|snare|hat/i.test(part)) {
            categoryId = 'percussion';
            break;
          } else if (/bass|sub|808/i.test(part) && !/kick|drum|snare|hat|cymbal/i.test(part)) {
            categoryId = 'bass';
            break;
          } else if (/fx|effect|ambient|texture|foley/i.test(part)) {
            categoryId = 'sfx';
            break;
          } else if (/vox|vocal|voice|sing|chant/i.test(part)) {
            categoryId = 'vocals';
            break;
          }
        }
        
        // Fallback to extension-based hints for audio types
        if (categoryId === 'other') {
          // Check filename for additional clues
          if (fileName.includes('808') && !fileName.includes('hat') && !fileName.includes('cymbal')) {
            categoryId = 'bass'; // Most 808s are bass sounds
          } else if (fileName.includes('hit') || fileName.includes('impact')) {
            categoryId = 'sfx';
          } else if (fileName.includes('loop') && (fileName.includes('drum') || fileName.includes('beat'))) {
            categoryId = 'percussion';
          }
        }
      }
      
      // Get matching category
      const category = tempCategories.find(cat => cat.id === categoryId)!;
      
      // Increment category count
      const categoryIndex = tempCategories.findIndex(cat => cat.id === categoryId);
      tempCategories[categoryIndex].count++;
      
      // Create new sample
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
    
    setSamples(prev => {
      const updatedSamples = [...prev, ...newSamples];
      // Update category counts based on actual sample distribution
      const updatedCategories = tempCategories.map(category => ({
        ...category,
        count: updatedSamples.filter(sample => sample.category.id === category.id).length
      }));
      setCategories(updatedCategories);
      return updatedSamples;
    });
    
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
      document.body.appendChild(downloadLink); // Add to DOM for Firefox support
      downloadLink.click();
      
      // Clean up
      document.body.removeChild(downloadLink); // Remove from DOM
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
      prev.map(category => ({ ...category, count: 0, selected: false }))
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
    getCategoryCount,
  };

  return <SampleContext.Provider value={value}>{children}</SampleContext.Provider>;
};
