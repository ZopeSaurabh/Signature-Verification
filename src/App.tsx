import React, { useState, useCallback } from 'react';
import { FileText, Shield, Zap } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ComparisonResult } from './components/ComparisonResult';
import { ImageProcessor } from './utils/imageProcessor';
import { PDFGenerator } from './utils/pdfGenerator';

function App() {
  const [signature1, setSignature1] = useState<File | null>(null);
  const [signature2, setSignature2] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string>('');
  const [preview2, setPreview2] = useState<string>('');
  const [similarity, setSimilarity] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = useCallback((file: File | null, type: 'signature1' | 'signature2') => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        if (type === 'signature1') {
          setSignature1(file);
          setPreview1(preview);
        } else {
          setSignature2(file);
          setPreview2(preview);
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (type === 'signature1') {
        setSignature1(null);
        setPreview1('');
      } else {
        setSignature2(null);
        setPreview2('');
      }
    }
    
    // Reset results when files change
    setSimilarity(-1);
    setError('');
  }, []);

  const compareSignatures = useCallback(async () => {
    if (!signature1 || !signature2) {
      setError('Please select both signature images');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await ImageProcessor.compareSignatures(signature1, signature2);
      setSimilarity(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during comparison');
    } finally {
      setIsLoading(false);
    }
  }, [signature1, signature2]);

  const downloadPDF = useCallback(async () => {
    if (!signature1 || !signature2 || similarity === -1) {
      return;
    }

    try {
      await PDFGenerator.generateReport(signature1, signature2, similarity);
    } catch (err) {
      setError('Failed to generate PDF report');
    }
  }, [signature1, signature2, similarity]);

  const canCompare = signature1 && signature2 && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Signature Verification System
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Secure Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Fast Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Verify Signatures with AI Precision
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload two signature images and get instant verification results with detailed similarity analysis. 
            Perfect for document authentication, fraud detection, and security compliance.
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <FileUpload
            title="Original Signature"
            onFileSelect={(file) => handleFileSelect(file, 'signature1')}
            selectedFile={signature1}
            preview={preview1}
          />
          <FileUpload
            title="Signature to Verify"
            onFileSelect={(file) => handleFileSelect(file, 'signature2')}
            selectedFile={signature2}
            preview={preview2}
          />
        </div>

        {/* Compare Button */}
        <div className="text-center mb-12">
          <button
            onClick={compareSignatures}
            disabled={!canCompare}
            className={`inline-flex items-center px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 ${
              canCompare
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-3" />
                Compare Signatures
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="max-w-md mx-auto">
          <ComparisonResult
            similarity={similarity}
            isLoading={isLoading}
            onDownloadPDF={downloadPDF}
          />
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
              <Shield className="h-6 w-6 text-blue-600 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Processing</h3>
            <p className="text-gray-600">All images are processed locally in your browser. No data is sent to external servers.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
              <Zap className="h-6 w-6 text-green-600 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Analysis</h3>
            <p className="text-gray-600">Get instant results with our optimized image processing algorithms.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
              <FileText className="h-6 w-6 text-purple-600 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Reports</h3>
            <p className="text-gray-600">Download detailed verification reports with similarity scores and analysis.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2025 Signature Verification System. Built with precision and security in mind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;