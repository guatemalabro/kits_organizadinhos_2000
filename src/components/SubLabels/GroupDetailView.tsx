
import React from 'react';
import SampleTable from './SampleTable';
import ActionButtons from './ActionButtons';

interface GroupDetailViewProps {
  selectedGroup: string;
  groupingResults: Record<string, string[]>;
  exportGroups: () => void;
  analyzeSamples: () => void;
}

const GroupDetailView: React.FC<GroupDetailViewProps> = ({ 
  selectedGroup, 
  groupingResults, 
  exportGroups, 
  analyzeSamples 
}) => {
  return (
    <>
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-medium text-orange-300 mb-4">{selectedGroup}</h3>
        <p className="text-gray-400 text-lg">
          {groupingResults[selectedGroup]?.length} samples with similar sonic characteristics
        </p>
      </div>
      
      <SampleTable 
        selectedGroup={selectedGroup} 
        sampleNames={groupingResults[selectedGroup] || []} 
      />
      
      <ActionButtons 
        exportGroups={exportGroups} 
        analyzeSamples={analyzeSamples} 
      />
    </>
  );
};

export default GroupDetailView;
