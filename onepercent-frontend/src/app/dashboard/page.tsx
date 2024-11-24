'use client';
import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Award, Calendar } from 'lucide-react';
import NutritionPlan from '@/components/layout/Nutrition';
import { motion } from 'framer-motion';
import VideoUpload from '@/components/layout/VideoUpload';
import AIWorkoutContainer from '@/components/layout/AIWorkoutContainer';
import MarathonPredictor from '@/components/layout/MarathonPredictor';

const newsData = [
  {
    title: 'Top Athletes Share Their Training Secrets',
    link: '#',
    image: 'https://via.placeholder.com/400x200',
    description: 'Discover the routines and habits that elite athletes swear by to maintain peak performance.',
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalWorkouts: 156,
    avgPerformance: 85,
    achievements: 12,
    ranking: 'Top 10%',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-gray-50 min-h-screen">
    {/* First Row: Stats */}
    <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        {
          icon: <Activity className="h-6 w-6 text-blue-400" />,
          label: 'Total Workouts',
          value: stats.totalWorkouts,
        },
        {
          icon: <TrendingUp className="h-6 w-6 text-green-400" />,
          label: 'Avg Performance',
          value: `${stats.avgPerformance}%`,
        },
        {
          icon: <Award className="h-6 w-6 text-yellow-400" />,
          label: 'Achievements',
          value: stats.achievements,
        },
        {
          icon: <Calendar className="h-6 w-6 text-purple-400" />,
          label: 'Ranking',
          value: stats.ranking,
        },
      ].map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-4"
        >
          <div className="bg-gray-100 rounded-full p-3">{stat.icon}</div>
          <div>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  
    {/* Second Row: Nutrition Plan & Marathon Predictor */}
    <div className="col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div
        className="lg:col-span-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <NutritionPlan />
      </motion.div>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
        <MarathonPredictor />
      </div>
    </div>
  
    {/* Third Row: Analyze Your Form */}
    <div className="col-span-12 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
      <AIWorkoutContainer>
        <VideoUpload />
      </AIWorkoutContainer>
    </div>
  </div>
  
  );
}
