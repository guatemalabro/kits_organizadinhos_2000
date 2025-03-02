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
      
      // More intelligent category assignment based on detailed filename patterns
      const fileName = file.name.toLowerCase();
      let categoryId = 'other';
      
      // Define pattern checks with stronger boundaries to prevent false matches
      const patternChecks = [
        // Kick patterns - make sure to exclude patterns that might be confused with other categories
        { 
          category: 'kicks', 
          patterns: [
            /\bkick\b/,
            /\bbd\b/,
            /\bbass\s*drum\b/,
            /\b808\s*kick\b/,
            /\bkik\b/
          ],
          excludePatterns: [/\bsn\b/, /\bsnare\b/, /\bhat\b/, /\bcymbal\b/, /\bperc\b/]
        },
        // Snare patterns
        { 
          category: 'snares', 
          patterns: [
            /\bsnare\b/, 
            /\bclap\b/, 
            /\brim\b/, 
            /\bsd\b/, 
            /\bsn\b/,
            /\bsnr\b/,
            /\bslap\b/
          ],
          excludePatterns: [/\bkick\b/, /\bhat\b/, /\bcymbal\b/]
        },
        // Hi-hat patterns
        { 
          category: 'hihats', 
          patterns: [
            /\bhat\b/, 
            /\bhh\b/, 
            /\bhi\b/,
            /\bhi[-\s]?hat\b/, 
            /\bcymbal\b/, 
            /\bcym\b/, 
            /\bcmbl\b/, 
            /\bclosed\b/, 
            /\bopen\b/, 
            /\btick\b/
          ],
          excludePatterns: [/\bkick\b/, /\bsnare\b/]
        },
        // Percussion patterns
        { 
          category: 'percussion', 
          patterns: [
            /\btom\b/, 
            /\bperc\b/, 
            /\bconga\b/, 
            /\bbongo\b/, 
            /\btamb\b/, 
            /\bshaker\b/, 
            /\bblock\b/, 
            /\btriangle\b/, 
            /\bdrum\b/, 
            /\bcajon\b/, 
            /\btimbale\b/
          ],
          excludePatterns: [/\bkick\b/, /\bsnare\b/, /\bhat\b/]
        },
        // Bass patterns (excluding drum patterns)
        { 
          category: 'bass', 
          patterns: [
            /\bbass\b/, 
            /\bsub\b/, 
            /\b808\b/
          ],
          excludePatterns: [/\bdrum\b/, /\bkick\b/]
        },
        // SFX patterns
        { 
          category: 'sfx', 
          patterns: [
            /\bfx\b/, 
            /\briser\b/, 
            /\bdown\b/, 
            /\bsweep\b/, 
            /\bimpact\b/, 
            /\bwhoosh\b/, 
            /\bsfx\b/, 
            /\beffect\b/, 
            /\btexture\b/, 
            /\bnoize\b/, 
            /\bnoise\b/, 
            /\bambient\b/, 
            /\batmos\b/
          ],
          excludePatterns: [/\bkick\b/, /\bsnare\b/, /\bhat\b/, /\bbass\b/]
        },
        // Vocal patterns
        { 
          category: 'vocals', 
          patterns: [
            /\bvox\b/, 
            /\bvocal\b/, 
            /\bvoice\b/, 
            /\bspeak\b/, 
            /\btalk\b/, 
            /\bsing\b/, 
            /\bchant\b/, 
            /\bchoir\b/, 
            /\bhuman\b/, 
            /\bscream\b/, 
            /\bshout\b/
          ],
          excludePatterns: []
        }
      ];
      
      // First pass: check for exact matches
      let matched = false;
      for (const check of patternChecks) {
        // Skip if any exclude pattern matches
        if (check.excludePatterns.some(pattern => pattern.test(fileName))) {
          continue;
        }
        
        // Check if any pattern matches
        if (check.patterns.some(pattern => pattern.test(fileName))) {
          categoryId = check.category;
          matched = true;
          break;
        }
      }
      
      // Second pass: check for partial matches if no exact match was found
      if (!matched) {
        // Try to infer based on file path if available
        // For example, if the file is in a folder named "kicks", it's likely a kick
        const pathParts = file.webkitRelativePath ? file.webkitRelativePath.toLowerCase().split('/') : [];
        for (const part of pathParts) {
          for (const check of patternChecks) {
            if (check.patterns.some(pattern => pattern.test(part))) {
              categoryId = check.category;
              matched = true;
              break;
            }
          }
          if (matched) break;
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
