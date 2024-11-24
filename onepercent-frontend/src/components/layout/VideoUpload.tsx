'use client';
import React, { useState, useCallback } from 'react';

const DEFAULT_CHUNK_SIZE = 1024 * 1024; // Default chunk size: 1MB

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [chunkSize, setChunkSize] = useState(DEFAULT_CHUNK_SIZE);
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const uploadChunk = async (chunk, chunkIndex, totalChunks) => {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', chunkIndex);
    formData.append('totalChunks', totalChunks);
    formData.append('fileName', file.name);

    const response = await fetch(`${API_BASE_URL}/ml/upload/chunk`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // If this is the last chunk, we'll get the analysis results
    if (chunkIndex === totalChunks - 1) {
      return responseData.analysis_results; // Modified to access the nested analysis_results
    }
    return null;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const maxSize = 200 * 1024 * 1024; // 200MB limit
      const minChunkSize = 256 * 1024;
      const maxChunkSize = 5 * 1024 * 1024;

      if (selectedFile.size > maxSize) {
        setUploadStatus('File size exceeds 200MB limit');
        return;
      }

      const sizeBasedChunkSize = Math.min(
        Math.max(Math.floor(selectedFile.size / 100), minChunkSize),
        maxChunkSize
      );

      setChunkSize(sizeBasedChunkSize);
      setFile(selectedFile);
      setUploadStatus('');
      setProgress(0);
      setAnalysisStatus('');
      setAnalysisResults(null);
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file) {
      setUploadStatus('Please select a file first.');
      return;
    }

    setUploadStatus('Starting upload...');
    const totalChunks = Math.ceil(file.size / chunkSize);

    try {
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const results = await uploadChunk(chunk, chunkIndex, totalChunks);
        const newProgress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        setProgress(newProgress);
        
        if (chunkIndex === totalChunks - 1 && results) {
          // This is the last chunk, update the UI with analysis results
          setUploadStatus('Analysis completed!');
          setAnalysisResults(results);
          console.log('Analysis results received:', results); // Added for debugging
        } else {
          setUploadStatus(`Uploading: ${newProgress}%`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error); // Added for debugging
      setUploadStatus(`Upload failed: ${error.message}`);
      setAnalysisStatus('');
    }
  }, [file, chunkSize]);

  return (
    <div className="space-y-4 p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold text-gray-800 text-center">
        AI-Powered Push-Up Analyzer
      </h1>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2"
      />

      <button
        onClick={handleUpload}
        disabled={!file || (progress > 0 && progress < 100)}
        className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {progress === 0 ? 'Upload Video' : progress < 100 ? 'Uploading...' : 'Re-upload'}
      </button>

      {uploadStatus && (
        <div className="mt-4">
          <div className="text-sm text-gray-700 mb-2">{uploadStatus}</div>
          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {analysisResults && (
        <div className="mt-6 space-y-6">
          {/* Metadata Section */}
          {analysisResults.metadata && (
            <div className="p-4 border rounded-lg bg-gray-50 shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Video Analysis</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Video Path:</span> {analysisResults.metadata.video_path}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Frames Analyzed:</span> {analysisResults.metadata.frames_analyzed}
                </p>
                {analysisResults.metadata.fps && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">FPS:</span> {analysisResults.metadata.fps}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Stats Section - Added null check */}
          {analysisResults.stats && (
            <div className="p-4 border rounded-lg bg-gray-50 shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Performance Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Total Push-ups</p>
                  <p className="text-xl font-bold text-gray-800">{analysisResults.stats.total_reps_attempted}</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Good Form</p>
                  <p className="text-xl font-bold text-green-600">{analysisResults.stats.good_form_reps}</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Bad Form</p>
                  <p className="text-xl font-bold text-red-600">{analysisResults.stats.bad_form_reps}</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-xl font-bold text-blue-600">
                    {analysisResults.stats.success_rate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bad Form Frames Section */}
          {analysisResults.bad_form_frames && analysisResults.bad_form_frames.length > 0 && (
            <div className="p-4 border rounded-lg bg-gray-50 shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Form Issues</h2>
              <div className="space-y-4">
                {analysisResults.bad_form_frames.map((frame, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={`data:image/jpeg;base64,${frame.image}`}
                          alt={`Bad form ${index + 1}`}
                          className="w-32 h-32 object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-gray-800">Rep #{frame.rep_number}</p>
                        <p className="text-sm text-red-600 mt-1">{frame.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Section */}
          {analysisResults.summary && (
            <div className="p-4 border rounded-lg bg-gray-50 shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Detailed Summary</h2>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-white p-3 rounded">
                {analysisResults.summary}
              </pre>
            </div>
          )}

          {/* Error Display */}
          {analysisResults.error && (
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Analysis Error</h2>
              <p className="text-sm text-red-600">{analysisResults.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;