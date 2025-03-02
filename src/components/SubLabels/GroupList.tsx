
import React from 'react';

interface GroupListProps {
  groupNames: string[];
  groupingResults: Record<string, string[]>;
  selectedGroup: string | null;
  setSelectedGroup: (groupName: string) => void;
  analyzeSamples: () => void;
  categories: Array<{ id: string; name: string; selected: boolean }>;
}

const GroupList: React.FC<GroupListProps> = ({ 
  groupNames, 
  groupingResults, 
  selectedGroup, 
  setSelectedGroup,
  analyzeSamples,
  categories
}) => {
  if (groupNames.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No groups available.</p>
        <p className="mt-2 text-sm text-gray-400">
          {categories.some(cat => cat.selected) 
            ? "Try selecting different categories or upload more samples." 
            : "Please select at least one category to analyze."}
        </p>
        <button 
          onClick={(e) => {
            e.preventDefault(); // Prevent default
            e.stopPropagation(); // Stop propagation
            analyzeSamples();
          }}
          className="mt-4 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm text-gray-300"
        >
          Run Analysis
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-20rem)] md:max-h-[calc(100vh-15rem)] pr-2">
      {groupNames.map((groupName) => (
        <button
          key={groupName}
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent default
            e.stopPropagation(); // Stop propagation
          }}
          onClick={(e) => {
            e.preventDefault(); // Prevent default
            e.stopPropagation(); // Stop propagation
            setSelectedGroup(groupName);
          }}
          className={`w-full text-left p-4 rounded-md transition-colors cursor-pointer ${
            selectedGroup === groupName 
              ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300' 
              : 'hover:bg-zinc-800/50 border border-zinc-800/40 text-gray-400'
          }`}
        >
          <div className="font-medium text-lg">{groupName}</div>
          <div className="text-sm text-gray-500 mt-1">
            {groupingResults[groupName]?.length || 0} samples
          </div>
        </button>
      ))}
    </div>
  );
};

export default GroupList;
