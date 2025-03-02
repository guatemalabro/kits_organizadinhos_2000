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

  // Enhanced sample analysis with more accurate categorization
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
      
      // Improved category assignment logic
      const fileName = file.name.toLowerCase();
      const filePath = file.webkitRelativePath?.toLowerCase() || '';
      let categoryId = 'other';
      
      // ENHANCED AUDIO CATEGORIZATION WITH STRICTER RULES
      
      // Process file paths for better context
      const pathParts = filePath.split('/').filter(Boolean);
      const folderContext = pathParts.join(' ').toLowerCase();
      
      // Crash detection - must come first to catch cymbals and crashes before other rules
      if (
        /crash/i.test(fileName) || 
        /cymbal/i.test(fileName) || 
        /ride/i.test(fileName) ||
        (/\bcr\b/.test(fileName) && !/crowd/i.test(fileName))
      ) {
        categoryId = 'hihats'; // Cymbals and crashes belong with hi-hats
      }
      // Hi-hat detection - specifically look for hi-hat related terms
      else if (
        /\bhi[\s-]?hat\b/i.test(fileName) || 
        /\bhh\b/.test(fileName) ||
        /\bhat\b/i.test(fileName) && !/\that\b/i.test(fileName) ||
        /\bopen\b/.test(fileName) && !/\bopen\s+loop\b/i.test(fileName) ||
        /\bclosed\b/.test(fileName)
      ) {
        categoryId = 'hihats';
      }
      // Kick detection with strict boundary cases
      else if (
        (/\bkick\b/i.test(fileName) || /\bbd\b/.test(fileName) || /\bbass\s*drum\b/i.test(fileName)) && 
        !(/snare/i.test(fileName) || /clap/i.test(fileName))
      ) {
        categoryId = 'kicks';
      }
      // Snare and clap detection
      else if (
        /\bsnare\b/i.test(fileName) || 
        /\bclap\b/i.test(fileName) || 
        /\brimshot\b/i.test(fileName) || 
        /\bsd\b/.test(fileName) || 
        (/\bsn\b/.test(fileName) && !/snare/i.test(fileName))
      ) {
        categoryId = 'snares';
      }
      // Bass detection - catch only true bass sounds, avoid percussion
      else if (
        (/\bbass\b/i.test(fileName) && !/\bbass\s+drum\b/i.test(fileName)) || 
        /\bsub\b/i.test(fileName) || 
        (/\b808\b/.test(fileName) && !/808\s+crash/i.test(fileName) && !/808\s+hat/i.test(fileName) && !/808\s+cymbal/i.test(fileName))
      ) {
        // Only pure bass sounds go here, not percussion
        categoryId = 'bass';
      }
      // Percussion detection
      else if (
        /\bperc\b/i.test(fileName) || 
        /\bconga\b/i.test(fileName) || 
        /\bbongo\b/i.test(fileName) ||
        /\btom\b/i.test(fileName) || 
        /\bshaker\b/i.test(fileName) || 
        /\btamb(ourine)?\b/i.test(fileName) ||
        /\bcajon\b/i.test(fileName) || 
        /\btriangle\b/i.test(fileName) || 
        /\bdjembe\b/i.test(fileName) ||
        /\btimpani\b/i.test(fileName) || 
        /\btabla\b/i.test(fileName)
      ) {
        categoryId = 'percussion';
      }
      // SFX detection
      else if (
        /\bfx\b/i.test(fileName) || 
        /\bsfx\b/i.test(fileName) || 
        /\bnoise\b/i.test(fileName) ||
        /\briser\b/i.test(fileName) || 
        /\bsweep\b/i.test(fileName) || 
        /\bimpact\b/i.test(fileName) ||
        /\bwhoosh\b/i.test(fileName) || 
        /\btexture\b/i.test(fileName) || 
        /\bambient\b/i.test(fileName) ||
        /\btransition\b/i.test(fileName) || 
        /\bfoley\b/i.test(fileName) ||
        /\bhit\b/i.test(fileName) && !/hithat/i.test(fileName)
      ) {
        categoryId = 'sfx';
      }
      // Vocal detection
      else if (
        /\bvocal\b/i.test(fileName) || 
        /\bvox\b/i.test(fileName) || 
        /\bvoice\b/i.test(fileName) ||
        /\bsing\b/i.test(fileName) || 
        /\btalk\b/i.test(fileName) || 
        /\bcry\b/i.test(fileName) ||
        /\bspeak\b/i.test(fileName) || 
        /\bscream\b/i.test(fileName) || 
        /\bchant\b/i.test(fileName) ||
        /\bsay\b/i.test(fileName) || 
        /\bword\b/i.test(fileName) || 
        /\bshout\b/i.test(fileName)
      ) {
        categoryId = 'vocals';
      }
      
      // Folder-based classification for edge cases
      if (categoryId === 'other') {
        for (const part of pathParts) {
          if (/\bcymbal|\bcrash|\bride/i.test(part)) {
            categoryId = 'hihats';
            break;
          } else if (/\bhihat|\bhi[\s-]?hat|\bhh|\bhat/i.test(part) && !/\bhat\b/i.test(part)) {
            categoryId = 'hihats';
            break;
          } else if (/\bkick|\bkik|\bbd|\bbass\s*drum/i.test(part) && !/snare|hat|cymbal/i.test(part)) {
            categoryId = 'kicks';
            break;
          } else if (/\bsnare|\bclap|\brimshot|\bsd|\bsn/i.test(part) && !/kick|hat|cymbal/i.test(part)) {
            categoryId = 'snares';
            break;
          } else if (/\bperc|\bconga|\bbongo|\btom|\btabla/i.test(part) && !/kick|snare|hat/i.test(part)) {
            categoryId = 'percussion';
            break;
          } else if (/\bbass|\bsub|\b808/i.test(part) && !/kick|drum|snare|hat|cymbal|crash/i.test(part)) {
            categoryId = 'bass';
            break;
          } else if (/\bfx|\beffect|\bambient|\btexture|\bfoley|\briser|\bsweep/i.test(part)) {
            categoryId = 'sfx';
            break;
          } else if (/\bvox|\bvocal|\bvoice|\bsing|\bchant/i.test(part)) {
            categoryId = 'vocals';
            break;
          }
        }
      }
      
      // Create simulated frequency content analysis (in a real app this would be actual audio analysis)
      // This code simulates spectral analysis to determine if a sound contains mostly low frequency content
      const simulateSpectralAnalysis = (filename: string): { 
        isLowFreq: boolean, 
        isMidFreq: boolean,
        isHighFreq: boolean,
        isPercussive: boolean 
      } => {
        const lowFreqTerms = ['bass', 'sub', '808', 'low', 'deep', 'boom', 'rumble'];
        const highFreqTerms = ['hat', 'cymbal', 'crash', 'ride', 'sizzle', 'high', 'hh', 'hi'];
        const percussiveTerms = ['perc', 'conga', 'bongo', 'tom', 'tabla', 'drum', 'hit'];
        
        const name = filename.toLowerCase();
        const isLowFreq = lowFreqTerms.some(term => name.includes(term));
        const isHighFreq = highFreqTerms.some(term => name.includes(term));
        const isPercussive = percussiveTerms.some(term => name.includes(term));
        const isMidFreq = !isLowFreq && !isHighFreq;
        
        return { isLowFreq, isMidFreq, isHighFreq, isPercussive };
      };
      
      // Apply spectral analysis for edge cases
      if (categoryId === 'other') {
        const spectralProfile = simulateSpectralAnalysis(fileName);
        
        // Use spectral analysis for further classification
        if (spectralProfile.isHighFreq) {
          categoryId = 'hihats';
        } else if (spectralProfile.isLowFreq && !spectralProfile.isPercussive) {
          categoryId = 'bass';
        } else if (spectralProfile.isPercussive) {
          if (spectralProfile.isLowFreq) {
            categoryId = 'kicks';
          } else {
            categoryId = 'percussion';
          }
        }
      }
      
      // Special case for 808 crashes - they must go to hi-hats, not bass
      if (/808\s+crash/i.test(fileName) || /808\s+cymbal/i.test(fileName)) {
        categoryId = 'hihats';
      }
      
      // Get matching category
      const category = tempCategories.find(cat => cat.id === categoryId)!;
      
      // Increment category count
      const categoryIndex = tempCategories.findIndex(cat => cat.id === categoryId);
      tempCategories[categoryIndex].count++;
      
      // Create new sample with more accurate analytics
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
