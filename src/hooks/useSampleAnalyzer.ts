
import { useState, useCallback } from 'react';
import { Sample, SampleCategory } from '@/types/sample';
import { determineSampleCategory, createSampleObject } from '@/utils/sampleUtils';

export const useSampleAnalyzer = (
  categories: SampleCategory[],
  setSamples: React.Dispatch<React.SetStateAction<Sample[]>>,
  setCategories: React.Dispatch<React.SetStateAction<SampleCategory[]>>
) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedCount, setAnalyzedCount] = useState(0);
  const [totalSamples, setTotalSamples] = useState(0);

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
      
      // Determine category
      const category = determineSampleCategory(
        file.name, 
        file.webkitRelativePath?.toLowerCase() || '', 
        tempCategories
      );
      
      // Increment category count
      const categoryIndex = tempCategories.findIndex(cat => cat.id === category.id);
      tempCategories[categoryIndex].count++;
      
      // Create new sample
      const newSample = createSampleObject(file, category, i);
      
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
  }, [categories, setCategories, setSamples]);

  const addSamples = useCallback((files: File[]) => {
    analyzeSamples(files);
  }, [analyzeSamples]);

  return { 
    isAnalyzing, 
    analyzedCount, 
    totalSamples, 
    addSamples 
  };
};
