import React from 'react';
import { CheckCircle, XCircle, Download, BarChart } from 'lucide-react';

interface ComparisonResultProps {
  similarity: number;
  isLoading: boolean;
  onDownloadPDF: () => void;
}

export const ComparisonResult: React.FC<ComparisonResultProps> = ({
  similarity,
  isLoading,
  onDownloadPDF
}) => {
  const threshold = 85;
  const isMatch = similarity >= threshold;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Analyzing signatures...</p>
      </div>
    );
  }

  if (similarity === -1) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
        isMatch ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {isMatch ? (
          <CheckCircle className="h-8 w-8 text-green-600" />
        ) : (
          <XCircle className="h-8 w-8 text-red-600" />
        )}
      </div>

      <h3 className={`text-2xl font-bold mb-4 ${
        isMatch ? 'text-green-600' : 'text-red-600'
      }`}>
        {isMatch ? 'Verification Successful ✅' : 'Verification Failed ❌'}
      </h3>

      <div className="mb-6">
        <div className="flex items-center justify-center mb-2">
          <BarChart className="h-5 w-5 text-gray-600 mr-2" />
          <span className="text-sm font-medium text-gray-600">Similarity Score</span>
        </div>
        <div className="text-4xl font-bold text-gray-800 mb-2">
          {similarity.toFixed(1)}%
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isMatch ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(similarity, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Threshold:</span> {threshold}% • 
          <span className="font-medium ml-1">Status:</span> {isMatch ? 'Match' : 'No Match'}
        </p>
      </div>

      <button
        onClick={onDownloadPDF}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Download className="h-5 w-5 mr-2" />
        Download PDF Report
      </button>
    </div>
  );
};