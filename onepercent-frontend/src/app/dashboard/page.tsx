'use client';
import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Award, Calendar } from 'lucide-react';
import NutritionPlan from '@/components/layout/Nutrition';
import { motion } from 'framer-motion';
import VideoUpload from '@/components/layout/VideoUpload';
import AIWorkoutContainer from '@/components/layout/AIWorkoutContainer';

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
<div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-20">      {/* First Row: Stats */}
      <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-20">
      {[
          {
            icon: <Activity className="h-6 w-6 text-blue-500" />,
            label: 'Total Workouts',
            value: stats.totalWorkouts,
          },
          {
            icon: <TrendingUp className="h-6 w-6 text-green-500" />,
            label: 'Avg Performance',
            value: `${stats.avgPerformance}%`,
          },
          {
            icon: <Award className="h-6 w-6 text-yellow-500" />,
            label: 'Achievements',
            value: stats.achievements,
          },
          {
            icon: <Calendar className="h-6 w-6 text-purple-500" />,
            label: 'Ranking',
            value: stats.ranking,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 flex items-center"
          >
            {stat.icon}
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Second Row: Nutrition Plan & Athlete News */}
      <div className="col-span-12 grid grid-cols-12 gap-6">
        <motion.div
          className="col-span-9 h-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <NutritionPlan />
        </motion.div>
        <div className="col-span-3 h-full bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            Athlete News
          </h2>
          <ul className="space-y-6">
            {newsData.map((newsItem, index) => (
              <motion.li
                key={index}
                className="flex items-start space-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5, ease: 'easeOut' }}
              >
                <img
                  src={newsItem.image}
                  alt={newsItem.title}
                  className="w-28 h-20 object-cover rounded-lg shadow-sm"
                />
                <div>
                  <a
                    href={newsItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-lg font-semibold"
                  >
                    {newsItem.title}
                  </a>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    {newsItem.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Third Row: Analyze Your Form */}
      <div className="col-span-12">
      <AIWorkoutContainer>
  <VideoUpload />
</AIWorkoutContainer>
    </div>
    </div>
  );
}
