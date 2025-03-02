import React, { useMemo } from 'react';
import { useSampleContext } from '@/context/SampleContext';
import { Sample } from '@/types/sample';

const formatDuration = (seconds: number | undefined): string => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const AudioPreview: React.FC = () => {
  const { getFilteredSamples, samples, playSample, stopSample, categories, isAnalyzing } = useSampleContext();
  
  const filteredSamples = useMemo(() => {
    return getFilteredSamples();
  }, [getFilteredSamples]);
  
  if (samples.length === 0 || isAnalyzing) {
    return null;
  }
  
  if (filteredSamples.length === 0) {
    return (
      <div className="w-full border rounded-xl p-8 text-center bg-secondary/30 animate-fade-in">
        <p className="text-muted-foreground">No samples match the selected categories</p>
      </div>
    );
  }

  const SampleItem: React.FC<{ sample: Sample }> = ({ sample }) => {
    return (
      <div className="group flex items-center space-x-4 p-4 rounded-xl transition-all hover:bg-secondary/50">
        <button
          onClick={() => sample.isPlaying ? stopSample() : playSample(sample.id)}
          className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
            sample.isPlaying 
              ? 'bg-primary text-white' 
              : 'bg-secondary group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary'
          }`}
        >
          {sample.isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
        
        <div className="flex-grow min-w-0">
          <div className="flex items-center">
            <div className="truncate font-medium">{sample.name}</div>
            <div className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
              {sample.category.name}
            </div>
          </div>
          
          <div className="mt-1 flex items-center space-x-4">
            <div className="flex-grow h-3 bg-secondary rounded-full overflow-hidden">
              <div className="flex space-x-0.5 h-full items-end">
                {sample.waveform?.map((value, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${sample.isPlaying ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    style={{ height: `${value * 100}%` }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex-shrink-0 text-xs text-muted-foreground">
              {formatDuration(sample.duration)}
            </div>
          </div>
          
          <div className="mt-1 flex items-center space-x-4 text-xs text-muted-foreground">
            <div>{formatFileSize(sample.size)}</div>
            {sample.bpm && <div>{sample.bpm} BPM</div>}
            {sample.key && <div>Key: {sample.key}</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full border rounded-xl overflow-hidden animate-fade-in">
      <div className="p-4 border-b bg-secondary/30 flex items-center justify-between">
        <h3 className="font-medium">Sample Preview ({filteredSamples.length})</h3>
        <div className="text-xs text-muted-foreground">
          Showing {filteredSamples.length} of {samples.length} samples
        </div>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {filteredSamples.map(sample => (
          <SampleItem key={sample.id} sample={sample} />
        ))}
      </div>
    </div>
  );
};

export default AudioPreview;
