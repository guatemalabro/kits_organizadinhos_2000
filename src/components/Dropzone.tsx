
import React, { useCallback } from 'react';
import { useSampleContext } from '@/context/SampleContext';

const Dropzone: React.FC = () => {
  const { addSamples, isAnalyzing, samples } = useSampleContext();
  
  const processFiles = useCallback(
    async (items: DataTransferItemList | FileList): Promise<File[]> => {
      const audioFiles: File[] = [];
      
      // Helper function to check if a file is an audio file
      const isAudioFile = (file: File) => {
        return file.type.startsWith('audio/') || 
               file.name.endsWith('.wav') || 
               file.name.endsWith('.mp3') || 
               file.name.endsWith('.aif') || 
               file.name.endsWith('.aiff');
      };
      
      // Helper function to recursively process directory entries
      const processEntry = async (entry: FileSystemEntry): Promise<void> => {
        if (entry.isFile) {
          const fileEntry = entry as FileSystemFileEntry;
          await new Promise<void>((resolve) => {
            fileEntry.file((file) => {
              if (isAudioFile(file)) {
                audioFiles.push(file);
              }
              resolve();
            });
          });
        } else if (entry.isDirectory) {
          const dirEntry = entry as FileSystemDirectoryEntry;
          const reader = dirEntry.createReader();
          
          // Read all entries in the directory
          await new Promise<void>((resolve) => {
            const readEntries = async () => {
              reader.readEntries(async (entries) => {
                if (entries.length === 0) {
                  resolve();
                  return;
                }
                
                // Process all entries
                await Promise.all(entries.map(processEntry));
                
                // Continue reading (readEntries can only read a limited number at a time)
                readEntries();
              });
            };
            
            readEntries();
          });
        }
      };
      
      // Handle both DataTransferItemList (for drag and drop) and FileList (for file input)
      if ('length' in items) {
        if (items.length > 0 && 'webkitGetAsEntry' in items[0]) {
          // It's a DataTransferItemList from drag and drop
          await Promise.all(
            Array.from(items as DataTransferItemList).map(async (item) => {
              const entry = item.webkitGetAsEntry();
              if (entry) {
                await processEntry(entry);
              }
            })
          );
        } else {
          // It's a FileList from file input
          Array.from(items as FileList).forEach((file) => {
            if (isAudioFile(file)) {
              audioFiles.push(file);
            }
          });
        }
      }
      
      return audioFiles;
    },
    []
  );
  
  const onDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isAnalyzing) return;
      
      if (e.dataTransfer.items) {
        const audioFiles = await processFiles(e.dataTransfer.items);
        if (audioFiles.length > 0) {
          addSamples(audioFiles);
        }
      }
    },
    [addSamples, isAnalyzing, processFiles]
  );
  
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleFileInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const audioFiles = await processFiles(e.target.files);
        if (audioFiles.length > 0) {
          addSamples(audioFiles);
        }
      }
    },
    [addSamples, processFiles]
  );
  
  return (
    <div
      className={`w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-300 ${
        isAnalyzing 
          ? 'border-primary/40 bg-primary/5' 
          : 'border-border bg-secondary/50 hover:border-primary/30 hover:bg-secondary'
      } flex flex-col items-center justify-center p-6 text-center animate-fade-in cursor-pointer`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      {isAnalyzing ? (
        <div className="flex flex-col items-center">
          <div className="flex space-x-1 mb-4">
            <div className="w-2 h-8 bg-primary/80 rounded-full animate-wave-1"></div>
            <div className="w-2 h-8 bg-primary/80 rounded-full animate-wave-2"></div>
            <div className="w-2 h-8 bg-primary/80 rounded-full animate-wave-3"></div>
            <div className="w-2 h-8 bg-primary/80 rounded-full animate-wave-4"></div>
            <div className="w-2 h-8 bg-primary/80 rounded-full animate-wave-5"></div>
          </div>
          <p className="text-lg font-medium text-foreground">Analyzing samples...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
        </div>
      ) : samples.length > 0 ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 mb-4 rounded-full bg-secondary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70">
              <path d="M9 17H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"></path>
              <path d="M12 15v6"></path>
              <path d="m9 18 3-3 3 3"></path>
            </svg>
          </div>
          <p className="text-lg font-medium text-foreground">Add more samples</p>
          <p className="text-sm text-muted-foreground mt-2">
            Drag and drop files or click to browse
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 mb-4 rounded-full bg-secondary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70">
              <path d="M9 17H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"></path>
              <path d="M12 15v6"></path>
              <path d="m9 18 3-3 3 3"></path>
            </svg>
          </div>
          <p className="text-lg font-medium text-foreground">Drag and drop samples</p>
          <p className="text-sm text-muted-foreground mt-2">
            or click to browse your files and folders
          </p>
          <p className="text-xs text-muted-foreground/70 mt-4">
            Supported formats: WAV, MP3, AIFF, AIF
          </p>
        </div>
      )}
      
      <input
        id="file-input"
        type="file"
        accept="audio/*,.wav,.mp3,.aiff,.aif"
        multiple
        // Using data attributes to fix TypeScript error
        data-directory=""
        data-webkitdirectory=""
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default Dropzone;
