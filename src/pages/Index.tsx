
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
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        
        <main className="flex-grow container-content py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Organize Your Samples</h2>
            <p className="text-muted-foreground">
              Upload your audio samples, let the analyzer categorize them, and export only what you need.
            </p>
          </div>
          
          <div className="mb-8">
            <Dropzone />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <CategorySelector />
            </div>
            
            <div className="lg:col-span-2">
              <AudioPreview />
            </div>
          </div>
          
          <ExportPanel />
        </main>
        
        <Footer />
      </div>
    </SampleProvider>
  );
};

export default Index;
