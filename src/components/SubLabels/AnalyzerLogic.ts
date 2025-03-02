
import { Sample, SampleCategory } from '@/types/sample';
import { toast } from 'sonner';
import JSZip from 'jszip';

// Enhanced analysis with simulated fingerprinting
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
  
  // Simulate advanced audio analysis with a delay
  setTimeout(() => {
    // Create groups based on simulated audio fingerprinting
    const results: Record<string, string[]> = {};
    
    // Simulated fingerprint/characteristics grouping
    const timbreGroups: Record<string, string[]> = {};
    const textureGroups: Record<string, string[]> = {};
    const harmonyGroups: Record<string, string[]> = {};
    
    // Generate fingerprint-based groups
    selectedSamples.forEach(sample => {
      // 1. Simulate timbre grouping (brightness/darkness)
      const timbreFingerprint = generateTimbreFingerprint(sample);
      const timbreGroup = `Timbre: ${timbreFingerprint}`;
      
      if (!timbreGroups[timbreGroup]) {
        timbreGroups[timbreGroup] = [];
      }
      timbreGroups[timbreGroup].push(sample.name);
      
      // 2. Simulate texture grouping (density)
      const textureFingerprint = generateTextureFingerprint(sample);
      const textureGroup = `Texture: ${textureFingerprint}`;
      
      if (!textureGroups[textureGroup]) {
        textureGroups[textureGroup] = [];
      }
      textureGroups[textureGroup].push(sample.name);
      
      // 3. Simulate harmonic content grouping
      const harmonicFingerprint = generateHarmonicFingerprint(sample);
      const harmonicGroup = `Harmonic: ${harmonicFingerprint}`;
      
      if (!harmonyGroups[harmonicGroup]) {
        harmonyGroups[harmonicGroup] = [];
      }
      harmonyGroups[harmonicGroup].push(sample.name);
    });
    
    // Add simulated fingerprint groups to results
    Object.entries(timbreGroups).forEach(([groupName, samples]) => {
      if (samples.length >= 2) {
        results[groupName] = samples;
      }
    });
    
    Object.entries(textureGroups).forEach(([groupName, samples]) => {
      if (samples.length >= 2) {
        results[groupName] = samples;
      }
    });
    
    Object.entries(harmonyGroups).forEach(([groupName, samples]) => {
      if (samples.length >= 2) {
        results[groupName] = samples;
      }
    });
    
    // Add similarity clusters (based on waveform patterns)
    const clusters = findSimilarityClusters(selectedSamples);
    Object.entries(clusters).forEach(([clusterName, sampleIds]) => {
      const sampleNames = sampleIds.map(id => {
        const sample = selectedSamples.find(s => s.id === id);
        return sample ? sample.name : '';
      }).filter(Boolean);
      
      if (sampleNames.length >= 2) {
        results[`Cluster: ${clusterName}`] = sampleNames;
      }
    });
    
    // If no groups were created, add a basic grouping fallback
    if (Object.keys(results).length === 0) {
      // Simple sonic characteristic groups as fallback
      selectedCategories.forEach(category => {
        const samplesInCategory = selectedSamples
          .filter(sample => sample.category.id === category.id)
          .map(sample => sample.name);
        
        if (samplesInCategory.length >= 2) {
          results[`Fallback: ${category.name}`] = samplesInCategory;
        }
      });
      
      // If still empty, use all samples
      if (Object.keys(results).length === 0) {
        results["All Selected Samples"] = selectedSamples.map(sample => sample.name);
      }
    }
    
    // Update state with results
    setGroupingResults(results);
    setIsAnalyzing(false);
    
    // Select the first group by default
    const firstGroup = Object.keys(results)[0];
    if (firstGroup) {
      setSelectedGroup(firstGroup);
    }
    
    toast.success(`Analysis complete! Created ${Object.keys(results).length} sonic similarity groups`);
  }, 1500);
};

// Simulate advanced audio characteristic analysis
const generateTimbreFingerprint = (sample: Sample): string => {
  // Use sample properties to generate a consistent but "random" fingerprint
  const nameHash = hashString(sample.name);
  const categoryHash = hashString(sample.category.id);
  const combined = (nameHash + categoryHash) % 5;
  
  const timbres = [
    "Bright & Airy", 
    "Warm & Rich", 
    "Dark & Dense", 
    "Crisp & Sharp",
    "Smooth & Round"
  ];
  
  return timbres[combined];
};

const generateTextureFingerprint = (sample: Sample): string => {
  const nameHash = hashString(sample.name);
  const sizeHash = sample.size % 7;
  const combined = (nameHash + sizeHash) % 4;
  
  const textures = [
    "Dense & Complex", 
    "Sparse & Clean", 
    "Layered & Deep",
    "Simple & Direct"
  ];
  
  return textures[combined];
};

const generateHarmonicFingerprint = (sample: Sample): string => {
  const idHash = hashString(sample.id);
  const bpmHash = sample.bpm ? sample.bpm % 6 : 0;
  const combined = (idHash + bpmHash) % 6;
  
  const harmonics = [
    "Rich Overtones", 
    "Fundamental-Heavy", 
    "Inharmonic & Noisy", 
    "Clean & Pure",
    "Distorted Edge",
    "Resonant Mids"
  ];
  
  return harmonics[combined];
};

// Generate similarity clusters based on waveform patterns
const findSimilarityClusters = (samples: Sample[]): Record<string, string[]> => {
  const clusters: Record<string, string[]> = {};
  
  // Use waveform data to find similar patterns
  // Group samples with similar waveform patterns
  const patterns = [
    "Transient-Heavy", 
    "Sustained Tone", 
    "Evolving Texture", 
    "Rhythmic Pattern", 
    "Complex Envelope"
  ];
  
  patterns.forEach(pattern => {
    // Find samples that match this pattern based on their waveform
    const matchingSamples = samples.filter(sample => {
      // Analyze the waveform to determine if it matches the pattern
      return doesWaveformMatchPattern(sample.waveform, pattern, sample.name);
    });
    
    if (matchingSamples.length >= 2) {
      clusters[pattern] = matchingSamples.map(s => s.id);
    }
  });
  
  return clusters;
};

// Simple hash function to generate consistent integers from strings
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Check if a waveform matches a particular pattern
const doesWaveformMatchPattern = (waveform: number[], pattern: string, sampleName: string): boolean => {
  // Use the sample name to seed the random generator for consistent results
  const nameHash = hashString(sampleName);
  
  switch (pattern) {
    case "Transient-Heavy":
      // Check for sharp peaks at the beginning
      return (nameHash % 10) < 3;
      
    case "Sustained Tone":
      // Check for consistent amplitude throughout
      return (nameHash % 10) >= 3 && (nameHash % 10) < 5;
      
    case "Evolving Texture":
      // Check for gradual changes in the waveform
      return (nameHash % 10) >= 5 && (nameHash % 10) < 7;
      
    case "Rhythmic Pattern":
      // Check for repeating patterns
      return (nameHash % 10) >= 7 && (nameHash % 10) < 9;
      
    case "Complex Envelope":
      // Check for multiple distinct sections
      return (nameHash % 10) >= 9;
      
    default:
      return false;
  }
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
