
import { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { Sample, SampleCategory } from '@/types/sample';

export const useExportSamples = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportSamples = useCallback(async (
    samples: Sample[], 
    categories: SampleCategory[]
  ) => {
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
  }, []);

  return { isExporting, exportSamples };
};
