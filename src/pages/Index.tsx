
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Dropzone from '@/components/Dropzone';
import CategorySelector from '@/components/CategorySelector';
import AudioPreview from '@/components/AudioPreview';
import ExportPanel from '@/components/ExportPanel';
import SubLabelsButton from '@/components/SubLabelsButton';
import { SampleProvider } from '@/context/SampleContext';

const Index = () => {
  return (
    <SampleProvider>
      <div className="flex flex-col min-h-screen bg-zinc-950 bg-gradient-to-b from-zinc-950 to-zinc-900 bg-opacity-50">
        <Header />
        
        <main className="flex-grow container-content py-10">
          <div className="mb-10 text-center vhs-glitch">
            <h2 className="text-4xl font-bold mb-3 text-gray-400 glitch-text" data-text="Organize Your Samples">
              Organize Your Samples
            </h2>
            <p className="text-gray-300/70 text-lg vhs-text" data-text="Upload your audio samples, let the analyzer categorize them, and export only what you need.">
              Upload your audio samples, let the analyzer categorize them, and export only what you need.
            </p>
          </div>
          
          <div className="mb-10 vhs-border rounded-lg overflow-hidden glass-dark">
            <Dropzone />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-1 vhs-border rounded-lg overflow-hidden glass-dark">
              <CategorySelector />
              <SubLabelsButton />
            </div>
            
            <div className="lg:col-span-2 vhs-border rounded-lg overflow-hidden glass-dark">
              <AudioPreview />
            </div>
          </div>
          
          <div className="vhs-border rounded-lg overflow-hidden glass-dark">
            <ExportPanel />
          </div>
        </main>
        
        <Footer />
      </div>
    </SampleProvider>
  );
};

export default Index;
