
import React from 'react';
import { toast } from 'sonner';
import { useSampleContext } from '@/context/SampleContext';

interface SampleTableProps {
  selectedGroup: string;
  sampleNames: string[];
}

const SampleTable: React.FC<SampleTableProps> = ({ selectedGroup, sampleNames }) => {
  const { playSample, samples } = useSampleContext();
  
  // Handle playing the sample - find the sample by name
  const handlePlaySample = (sampleName: string) => {
    const sample = samples.find(s => s.name === sampleName);
    if (sample) {
      playSample(sample.id);
      toast.info(`Playing sample: ${sampleName}`);
    } else {
      toast.error(`Sample not found: ${sampleName}`);
    }
  };
  
  return (
    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700/30 p-6 md:p-8 mb-8">
      <h4 className="text-xl font-medium text-gray-300 mb-6">Samples in this group</h4>
      
      <div className="overflow-y-auto max-h-[40vh] md:max-h-[50vh] pr-2">
        <table className="w-full">
          <thead className="border-b border-zinc-700/50 sticky top-0 bg-zinc-800/90 z-10">
            <tr>
              <th className="text-left text-sm font-medium text-gray-500 p-4 w-16">#</th>
              <th className="text-left text-sm font-medium text-gray-500 p-4">Sample Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {sampleNames.map((sampleName, index) => (
              <tr 
                key={index} 
                className="hover:bg-zinc-700/20 group cursor-pointer transition-colors"
                onClick={() => handlePlaySample(sampleName)}
              >
                <td className="py-4 px-4 text-gray-500 text-base">{index + 1}</td>
                <td className="py-4 px-4 text-gray-300 text-lg group-hover:text-orange-300 transition-colors">{sampleName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SampleTable;
