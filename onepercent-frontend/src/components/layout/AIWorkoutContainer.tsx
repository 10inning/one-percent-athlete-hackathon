import React from 'react';
import { Activity, Dumbbell, Brain, Sparkles } from 'lucide-react';
import VideoUpload from './VideoUpload';

const AIWorkoutContainer = () => {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Floating icons animation */}
      <div className="absolute -left-4 top-4 animate-bounce">
        <Dumbbell className="w-10 h-10 text-blue-400 opacity-30" />
      </div>
      <div className="absolute -right-4 top-12 animate-pulse">
        <Brain className="w-10 h-10 text-purple-400 opacity-30" />
      </div>
      <div className="absolute left-8 bottom-8 animate-pulse delay-100">
        <Sparkles className="w-8 h-8 text-indigo-400 opacity-30" />
      </div>

      {/* Main container */}
      <div className="relative w-full h-full bg-white/90 backdrop-blur-sm rounded-none shadow-2xl flex flex-col items-center justify-center p-8">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Workout Analyzer
            </h2>
          </div>
          <p className="text-gray-600 text-lg">Upload your workout video for instant AI-powered analysis</p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['Real-time Analysis', 'Form Correction', 'Performance Metrics'].map((feature) => (
            <span
              key={feature}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold shadow-sm animate-fade-in"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Video upload component */}
        <div className="w-full max-w-4xl bg-gray-50 rounded-lg shadow-lg p-6">
          <VideoUpload />
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-gray-500">
          Supports MP4, MOV, AVI formats • Max file size 500MB
        </div>
      </div>
    </div>
  );
};

export default AIWorkoutContainer;
