
import { Sample, SampleCategory } from '@/types/sample';

// Default categories
export const defaultCategories: SampleCategory[] = [
  { id: 'kicks', name: 'Kicks', count: 0, selected: false },
  { id: 'snares', name: 'Snares/Claps', count: 0, selected: false },
  { id: 'hihats', name: 'Hi-Hats', count: 0, selected: false },
  { id: 'percussion', name: 'Percussion', count: 0, selected: false },
  { id: 'bass', name: 'Bass', count: 0, selected: false },
  { id: 'sfx', name: 'SFX', count: 0, selected: false },
  { id: 'vocals', name: 'Vocals', count: 0, selected: false },
  { id: 'other', name: 'Other', count: 0, selected: false },
];

// Helper to determine category for a file
export const determineSampleCategory = (fileName: string, filePath: string, categories: SampleCategory[]): SampleCategory => {
  // Convert to lowercase for case-insensitive comparison
  fileName = fileName.toLowerCase();
  filePath = filePath.toLowerCase();
  
  // Process file paths for better context
  const pathParts = filePath.split('/').filter(Boolean);
  
  // ENHANCED AUDIO CATEGORIZATION WITH STRICTER RULES
  let categoryId = 'other';
  
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
  
  // Spectral analysis
  if (categoryId === 'other') {
    const spectralProfile = simulateSpectralAnalysis(fileName);
    
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
  return categories.find(cat => cat.id === categoryId) || categories.find(cat => cat.id === 'other')!;
};

// Simulate spectral analysis (in a real app this would be actual audio analysis)
export const simulateSpectralAnalysis = (filename: string): { 
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

// Create a fake waveform for visualization
export const generateFakeWaveform = (): number[] => {
  return Array.from({ length: 50 }, () => Math.random());
};

// Generate realistic sample data
export const createSampleObject = (
  file: File, 
  category: SampleCategory, 
  index: number
): Sample => {
  return {
    id: `sample-${Date.now()}-${index}`,
    name: file.name,
    path: URL.createObjectURL(file),
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
    category: category,
    waveform: generateFakeWaveform(),
    duration: Math.random() * 5,
    bpm: Math.floor(Math.random() * 40) + 80,
    key: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][Math.floor(Math.random() * 12)],
  };
};
