'use client';
import React, { useState, useCallback } from 'react';
import { FiUpload, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const DEFAULT_CHUNK_SIZE = 1024 * 1024; // Default chunk size: 1MB

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [chunkSize, setChunkSize] = useState(DEFAULT_CHUNK_SIZE);
  const [uploadStatus, setUploadStatus] = useState('');
  const [progress, setProgress] = useState(0);
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

    if (chunkIndex === totalChunks - 1) {
      return responseData.analysis_results;
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
          setUploadStatus('Analysis completed!');
          setAnalysisResults(results);
        } else {
          setUploadStatus(`Uploading: ${newProgress}%`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  }, [file, chunkSize]);

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        <span className="text-blue-600">AI</span>-Powered Workout Analyzer
      </h1>

      {/* File Upload Section */}
      <div className="flex flex-col items-center">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex items-center space-x-3 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition-all"
        >
          <FiUpload className="text-lg" />
          <span>Select Video File</span>
        </label>
      </div>

      {/* Upload Button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={progress > 0 && progress < 100}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {progress === 0
            ? 'Start Upload'
            : progress < 100
            ? 'Uploading...'
            : 'Re-upload'}
        </button>
      )}

      {/* Progress and Status */}
      {uploadStatus && (
        <div className="mt-4 text-center">
          {uploadStatus.includes('failed') ? (
            <FiXCircle className="text-red-600 text-xl mx-auto mb-2" />
          ) : uploadStatus.includes('completed') ? (
            <FiCheckCircle className="text-green-600 text-xl mx-auto mb-2" />
          ) : (
            <AiOutlineLoading3Quarters className="text-blue-600 text-xl mx-auto mb-2 animate-spin" />
          )}
          <p className="text-sm text-gray-700">{uploadStatus}</p>
          {progress > 0 && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Analysis Results */}
      {analysisResults && (
        <div className="mt-6 space-y-8">
          <div className="p-6 bg-gray-50 border rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800">Video Analysis</h2>
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-medium">Video Path:</span>{' '}
              {analysisResults.metadata.video_path}
            </p>
          </div>

          <div className="p-6 bg-gray-50 border rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800">Performance Summary</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-white shadow rounded-lg">
                <p className="text-sm text-gray-600">Total Push-ups</p>
                <p className="text-xl font-bold text-gray-800">
                  {analysisResults.stats.total_reps_attempted}
                </p>
              </div>
              <div className="p-4 bg-white shadow rounded-lg">
                <p className="text-sm text-gray-600">Good Form</p>
                <p className="text-xl font-bold text-green-600">
                  {analysisResults.stats.good_form_reps}
                </p>
              </div>
              {/* Add similar blocks for other stats */}
            </div>
          </div>

          {analysisResults.bad_form_frames && (
            <div className="p-6 bg-gray-50 border rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-800">Form Issues</h2>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {analysisResults.bad_form_frames.map((frame, index) => (
                  <div key={index} className="p-4 bg-white shadow rounded-lg">
                    <img
                      src={`data:image/jpeg;base64,${frame.image}`}
                      alt={`Issue ${index}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <p className="text-sm mt-2">{frame.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
