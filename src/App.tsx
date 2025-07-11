import React, { useState } from 'react';
import { Dna } from 'lucide-react';
import FileUpload from './components/FileUpload';
import MatchSelector from './components/MatchSelector';
import MetricSelector from './components/MetricSelector';
import ComparisonMatrix from './components/ComparisonMatrix';
import { ParsedDNAData, SelectedMatch, ComparisonMetric } from './types/dna';
import { parseCSVFile, aggregateMatchData } from './utils/dnaParser';

const COMPARISON_METRICS: ComparisonMetric[] = [
  {
    id: 'relationship',
    name: 'Relationship Range',
    description: 'Shows estimated relationship categories based on shared centiMorgans'
  },
  {
    id: 'total_cm',
    name: 'Total Shared cM',
    description: 'Displays total centiMorgans shared between matches'
  },
  {
    id: 'longest_segment',
    name: 'Longest Segment',
    description: 'Shows the longest shared DNA segment in centiMorgans'
  }
];

function App() {
  const [dnaData, setDnaData] = useState<ParsedDNAData | null>(null);
  const [availableMatches, setAvailableMatches] = useState<SelectedMatch[]>([]);
  const [selectedMatches, setSelectedMatches] = useState<SelectedMatch[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('relationship');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (csvText: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const parsedData = parseCSVFile(csvText);
      const aggregatedMatches = aggregateMatchData(parsedData.matches);
      
      setDnaData(parsedData);
      setAvailableMatches(aggregatedMatches);
      setSelectedMatches([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatchSelect = (match: SelectedMatch) => {
    setSelectedMatches(prev => [...prev, match]);
  };

  const handleMatchRemove = (matchName: string) => {
    setSelectedMatches(prev => prev.filter(match => match.matchName !== matchName));
  };

  const resetData = () => {
    setDnaData(null);
    setAvailableMatches([]);
    setSelectedMatches([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Dna className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DNA Match Matrix</h1>
                <p className="text-sm text-gray-600">Compare and analyze DNA matches</p>
              </div>
            </div>
            {dnaData && (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{dnaData.totalMatches}</span> matches loaded
                </div>
                <button
                  onClick={resetData}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Upload New File
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!dnaData ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                DNA Match Comparison Tool
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your DNA match CSV file to create a comprehensive comparison matrix. 
                Identify relationship patterns, triangulation groups, and shared matches at a glance.
              </p>
            </div>
            
            <FileUpload 
              onFileUpload={handleFileUpload}
              isLoading={isLoading}
              error={error}
            />
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Upload CSV</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload your DNA match data with required columns
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Select Matches</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose which matches to include in your comparison
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h4 className="font-medium text-gray-900">View Matrix</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Analyze pairwise relationships in an interactive matrix
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dnaData.totalMatches}</div>
                  <div className="text-sm text-gray-600">Total Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{availableMatches.length}</div>
                  <div className="text-sm text-gray-600">Unique Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedMatches.length}</div>
                  <div className="text-sm text-gray-600">Selected Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {dnaData.totalCentimorgans.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Total cM</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Match Selection */}
              <div className="lg:col-span-2 space-y-8">
                <MatchSelector
                  availableMatches={availableMatches}
                  selectedMatches={selectedMatches}
                  onMatchSelect={handleMatchSelect}
                  onMatchRemove={handleMatchRemove}
                />
              </div>

              {/* Right Column - Metric Selection */}
              <div>
                <MetricSelector
                  metrics={COMPARISON_METRICS}
                  selectedMetric={selectedMetric}
                  onMetricChange={setSelectedMetric}
                />
              </div>
            </div>

            {/* Comparison Matrix */}
            <ComparisonMatrix
              selectedMatches={selectedMatches}
              metric={selectedMetric}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;