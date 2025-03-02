
import { Sample, SampleCategory } from '@/types/sample';
import { toast } from 'sonner';
import JSZip from 'jszip';

// Analyze audio samples and group them
export const analyzeAudioSamples = (
  samples: Sample[],
  categories: SampleCategory[],
  setIsAnalyzing: (isAnalyzing: boolean) => void,
  setGroupingResults: (results: Record<string, string[]>) => void,
  setSelectedGroup: (group: string | null) => void
) => {
  // Show loading state
  setIsAnalyzing(true);
  
  // Get only selected categories
  const selectedCategories = categories.filter(category => category.selected);
  if (selectedCategories.length === 0) {
    toast.error("Please select at least one category to analyze");
    setIsAnalyzing(false);
    return;
  }
  
  // Get samples from selected categories
  const selectedSamples = samples.filter(sample => 
    selectedCategories.some(category => category.id === sample.category.id)
  );
  
  if (selectedSamples.length === 0) {
    toast.error("No samples found in the selected categories");
    setIsAnalyzing(false);
    return;
  }
  
  // Simulate analysis with a delay (in a real app, this would be a real analysis)
  setTimeout(() => {
    // Create some sample groups based on the sample categories
    const results: Record<string, string[]> = {};
    
    // Group by characteristics
    // In a real app, this would use audio analysis to determine similarity
    
    // Simulate grouping by BPM ranges
    const bpmGroups: Record<string, string[]> = {};
    const keyGroups: Record<string, string[]> = {};
    
    // Simulate grouping by BPM
    selectedSamples.forEach(sample => {
      if (sample.bpm) {
        const bpmRange = Math.floor(sample.bpm / 10) * 10;
        const groupName = `Tempo ${bpmRange}-${bpmRange + 10} BPM`;
        
        if (!bpmGroups[groupName]) {
          bpmGroups[groupName] = [];
        }
        
        bpmGroups[groupName].push(sample.name);
      }
      
      // Group by key
      if (sample.key) {
        const groupName = `Key: ${sample.key}`;
        
        if (!keyGroups[groupName]) {
          keyGroups[groupName] = [];
        }
        
        keyGroups[groupName].push(sample.name);
      }
    });
    
    // Add BPM groups to results
    Object.keys(bpmGroups).forEach(groupName => {
      if (bpmGroups[groupName].length >= 2) {
        results[groupName] = bpmGroups[groupName];
      }
    });
    
    // Add key groups to results
    Object.keys(keyGroups).forEach(groupName => {
      if (keyGroups[groupName].length >= 2) {
        results[groupName] = keyGroups[groupName];
      }
    });
    
    // Add categories as groups
    selectedCategories.forEach(category => {
      const samplesInCategory = selectedSamples
        .filter(sample => sample.category.id === category.id)
        .map(sample => sample.name);
      
      if (samplesInCategory.length >= 2) {
        results[category.name] = samplesInCategory;
      }
    });
    
    // If no groups were created, add a default group
    if (Object.keys(results).length === 0) {
      results["All Selected Samples"] = selectedSamples.map(sample => sample.name);
    }
    
    // Update state with results
    setGroupingResults(results);
    setIsAnalyzing(false);
    
    // Select the first group by default
    const firstGroup = Object.keys(results)[0];
    if (firstGroup) {
      setSelectedGroup(firstGroup);
    }
    
    toast.success(`Analysis complete! Created ${Object.keys(results).length} groups`);
  }, 1500);
};

// Export sample groups as ZIP file
export const exportSampleGroups = (
  groupName: string,
  sampleNames: string[],
  allSamples: Sample[]
) => {
  // Create a new JSZip instance
  const zip = new JSZip();
  
  // Create a folder for the group
  const groupFolder = zip.folder(groupName);
  
  if (!groupFolder) {
    toast.error("Failed to create group folder");
    return;
  }
  
  // Find the samples in the allSamples array
  const samplesToExport = allSamples.filter(sample => 
    sampleNames.includes(sample.name)
  );
  
  if (samplesToExport.length === 0) {
    toast.error("No samples found to export");
    return;
  }
  
  toast.info(`Preparing ${samplesToExport.length} samples for export...`);
  
  // In a real app, we would add the actual audio files to the ZIP
  // For this demo, we'll create text files with sample info
  samplesToExport.forEach((sample, index) => {
    const sampleInfo = `
Sample Name: ${sample.name}
Category: ${sample.category.name}
Size: ${sample.size} bytes
${sample.bpm ? `BPM: ${sample.bpm}` : ''}
${sample.key ? `Key: ${sample.key}` : ''}
Duration: ${sample.duration ? `${sample.duration.toFixed(2)} seconds` : 'Unknown'}
    `;
    
    groupFolder.file(`${index + 1}_${sample.name}.txt`, sampleInfo);
  });
  
  // Generate the ZIP file and trigger download
  zip.generateAsync({ type: "blob" })
    .then(function(content) {
      // Create a download link
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${groupName.replace(/\s+/g, '_')}_Samples.zip`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.success(`Exported ${samplesToExport.length} samples as ZIP file`);
    })
    .catch(error => {
      console.error("Error generating ZIP:", error);
      toast.error("Failed to generate ZIP file");
    });
};
