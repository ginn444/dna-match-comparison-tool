import React from 'react';
import { Settings, Info } from 'lucide-react';
import { ComparisonMetric } from '../types/dna';

interface MetricSelectorProps {
  metrics: ComparisonMetric[];
  selectedMetric: string;
  onMetricChange: (metricId: string) => void;
}

const MetricSelector: React.FC<MetricSelectorProps> = ({
  metrics,
  selectedMetric,
  onMetricChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Settings className="w-5 h-5 mr-2 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Comparison Metric</h3>
      </div>
      
      <div className="space-y-3">
        {metrics.map((metric) => (
          <label
            key={metric.id}
            className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedMetric === metric.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="metric"
              value={metric.id}
              checked={selectedMetric === metric.id}
              onChange={(e) => onMetricChange(e.target.value)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{metric.name}</div>
              <div className="text-sm text-gray-600 mt-1">{metric.description}</div>
            </div>
          </label>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">About the Matrix</p>
            <p className="mt-1">
              The matrix shows pairwise relationships between selected matches. 
              Higher centiMorgan values indicate closer relationships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricSelector;