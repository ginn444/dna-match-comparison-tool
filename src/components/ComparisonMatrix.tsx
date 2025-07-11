import React, { useMemo, useRef, useState } from 'react';
import { SelectedMatch, MatrixCell } from '../types/dna';
import { estimateRelationship } from '../utils/dnaParser';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

interface ComparisonMatrixProps {
  selectedMatches: SelectedMatch[];
  metric: string;
}

const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ selectedMatches, metric }) => {
  const matrixRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const matrixData = useMemo(() => {
    const matrix: MatrixCell[][] = [];
    
    selectedMatches.forEach((match1, i) => {
      const row: MatrixCell[] = [];
      selectedMatches.forEach((match2, _j) => {
        if (i === _j) {
          // Self comparison
          row.push({
            match1: match1.matchName,
            match2: match2.matchName,
            relationship: null,
            value: 0,
            metric
          });
        } else {
          // For demonstration, we'll simulate shared cM between matches
          // In a real application, this would come from actual DNA comparison data
          const simulatedSharedCM = Math.random() * 100;
          const relationship = estimateRelationship(simulatedSharedCM);
          
          row.push({
            match1: match1.matchName,
            match2: match2.matchName,
            relationship,
            value: simulatedSharedCM,
            metric
          });
        }
      });
      matrix.push(row);
    });
    
    return matrix;
  }, [selectedMatches, metric]);

  const getValueDisplay = (cell: MatrixCell) => {
    if (cell.match1 === cell.match2) return '—';
    
    switch (metric) {
      case 'relationship':
        return cell.relationship 
          ? `${cell.relationship.min}${cell.relationship.min !== cell.relationship.max ? ` – ${cell.relationship.max}` : ''}`
          : 'No match';
      case 'total_cm':
        return `${cell.value.toFixed(1)} cM`;
      case 'longest_segment':
        return `${cell.value.toFixed(1)} cM`;
      default:
        return cell.value.toFixed(1);
    }
  };

  const getCellStyle = (cell: MatrixCell) => {
    if (cell.match1 === cell.match2) {
      return 'bg-gray-100 text-gray-500';
    }
    
    if (cell.relationship) {
      return `text-white font-medium`;
    }
    
    return 'bg-gray-50 text-gray-600';
  };

  const getCellBackgroundColor = (cell: MatrixCell) => {
    if (cell.match1 === cell.match2) return {};
    if (cell.relationship) {
      return { backgroundColor: cell.relationship.color };
    }
    return {};
  };

  const exportToPDF = async () => {
    if (!matrixRef.current) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(matrixRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('DNA Match Comparison Matrix', 10, 15);
      pdf.setFontSize(12);
      pdf.text(`Metric: ${metric.replace('_', ' ')} | Matches: ${selectedMatches.length}`, 10, 25);
      
      // Add the matrix image
      pdf.addImage(imgData, 'PNG', 10, 35, imgWidth, imgHeight);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `dna-matrix-${metric}-${timestamp}.pdf`;
      
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (selectedMatches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-500">
          <p className="text-lg font-medium">No matches selected</p>
          <p className="text-sm mt-2">Select at least 2 matches to see the comparison matrix</p>
        </div>
      </div>
    );
  }

  if (selectedMatches.length === 1) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-500">
          <p className="text-lg font-medium">Select more matches</p>
          <p className="text-sm mt-2">Add at least one more match to see comparisons</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Comparison Matrix ({selectedMatches.length} × {selectedMatches.length})
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Showing {metric.replace('_', ' ')} comparisons
          </div>
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              isExporting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>
      
      <div ref={matrixRef} className="overflow-x-auto print-friendly">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left font-medium text-gray-900 border-b border-gray-200 bg-gray-50">
                Match Name
              </th>
              {selectedMatches.map((match) => (
                <th
                  key={match.matchName}
                  className="p-3 text-center font-medium text-gray-900 border-b border-gray-200 bg-gray-50 min-w-32"
                >
                  <div className="truncate" title={match.matchName}>
                    {match.matchName.length > 12 
                      ? `${match.matchName.substring(0, 12)}...` 
                      : match.matchName}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixData.map((row, i) => (
              <tr key={selectedMatches[i].matchName}>
                <td className="p-3 font-medium text-gray-900 border-b border-gray-100 bg-gray-50">
                  <div className="truncate" title={selectedMatches[i].matchName}>
                    {selectedMatches[i].matchName}
                  </div>
                </td>
                {row.map((cell) => (
                  <td
                    key={`${cell.match1}-${cell.match2}`}
                    className={`p-3 text-center text-sm border-b border-gray-100 ${getCellStyle(cell)}`}
                    style={getCellBackgroundColor(cell)}
                  >
                    {getValueDisplay(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Relationship Color Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>Parent/Child</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-600 rounded"></div>
            <span>Sibling</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-600 rounded"></div>
            <span>Grandparent/Aunt/Uncle</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-600 rounded"></div>
            <span>1st Cousin</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-lime-600 rounded"></div>
            <span>2nd Cousin</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-600 rounded"></div>
            <span>3rd Cousin</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-cyan-600 rounded"></div>
            <span>4th Cousin</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>5th+ Cousin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonMatrix;