
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Dropzone from '@/components/Dropzone';
import CategorySelector from '@/components/CategorySelector';
import AudioPreview from '@/components/AudioPreview';
import ExportPanel from '@/components/ExportPanel';
import { SampleProvider } from '@/context/SampleContext';

const Index = () => {
  return (
    <SampleProvider>
      <div className="flex flex-col min-h-screen bg-zinc-950 bg-gradient-to-b from-zinc-950 to-zinc-900 bg-opacity-50">
        <Header />
        
        <main className="flex-grow container-content py-10">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)] matrix-glow">
              Organize Your Samples
            </h2>
            <p className="text-gray-300/70 text-lg">
              Upload your audio samples, let the analyzer categorize them, and export only what you need.
            </p>
          </div>
          
          <div className="mb-10 vhs-border rounded-lg overflow-hidden">
            <Dropzone />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-1 vhs-border rounded-lg overflow-hidden">
              <CategorySelector />
            </div>
            
            <div className="lg:col-span-2 vhs-border rounded-lg overflow-hidden">
              <AudioPreview />
            </div>
          </div>
          
          <div className="vhs-border rounded-lg overflow-hidden">
            <ExportPanel />
          </div>
        </main>
        
        <Footer />
      </div>
    </SampleProvider>
  );
};

export default Index;
