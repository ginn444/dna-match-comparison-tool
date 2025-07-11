import React, { useState, useMemo } from 'react';
import { Search, Plus, X, Users } from 'lucide-react';
import { SelectedMatch } from '../types/dna';

interface MatchSelectorProps {
  availableMatches: SelectedMatch[];
  selectedMatches: SelectedMatch[];
  onMatchSelect: (match: SelectedMatch) => void;
  onMatchRemove: (matchName: string) => void;
}

const MatchSelector: React.FC<MatchSelectorProps> = ({
  availableMatches,
  selectedMatches,
  onMatchSelect,
  onMatchRemove
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredMatches = useMemo(() => {
    return availableMatches.filter(match => 
      match.matchName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedMatches.some(selected => selected.matchName === match.matchName)
    );
  }, [availableMatches, selectedMatches, searchTerm]);

  const handleMatchSelect = (match: SelectedMatch) => {
    onMatchSelect(match);
    setSearchTerm('');
    setShowDropdown(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Add Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Select Matches
          </h3>
          <span className="text-sm text-gray-500">
            {availableMatches.length} available matches
          </span>
        </div>
        
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search matches..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {showDropdown && filteredMatches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
              {filteredMatches.slice(0, 10).map((match) => (
                <button
                  key={match.matchName}
                  onClick={() => handleMatchSelect(match)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">{match.matchName}</div>
                    <div className="text-sm text-gray-500">
                      {match.totalCentimorgans.toFixed(1)} cM • {match.segmentCount} segments
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-green-500" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Matches */}
      {selectedMatches.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Selected Matches ({selectedMatches.length})
            </h3>
            <button
              onClick={() => selectedMatches.forEach(match => onMatchRemove(match.matchName))}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          </div>
          
          <div className="space-y-2">
            {selectedMatches.map((match) => (
              <div
                key={match.matchName}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{match.matchName}</div>
                  <div className="text-sm text-gray-500">
                    {match.totalCentimorgans.toFixed(1)} cM • 
                    Longest: {match.longestSegment.toFixed(1)} cM • 
                    {match.segmentCount} segments
                  </div>
                </div>
                <button
                  onClick={() => onMatchRemove(match.matchName)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchSelector;