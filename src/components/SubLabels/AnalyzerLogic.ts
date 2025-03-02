import { toast } from 'sonner';

export type SampleType = {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
};

export type CategoryType = {
  id: string;
  name: string;
  selected: boolean;
};

export const analyzeAudioSamples = (
  samples: SampleType[],
  categories: CategoryType[],
  setIsAnalyzing: (isAnalyzing: boolean) => void,
  setGroupingResults: (results: Record<string, string[]>) => void,
  setSelectedGroup: (group: string | null) => void
): void => {
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
    const samplesByCategory: Record<string, SampleType[]> = {};
    
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

export const exportSampleGroups = (): void => {
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
