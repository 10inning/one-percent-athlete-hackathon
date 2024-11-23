
'use client';
import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Activity, TrendingUp, Award, Calendar
} from 'lucide-react';
import NutritionPlan from '@/components/layout/Nutrition'; // Import the NutritionPlan component

const performanceData = [
  { month: 'Jan', performance: 65 },
  { month: 'Feb', performance: 75 },
  { month: 'Mar', performance: 85 },
  { month: 'Apr', performance: 82 },
  { month: 'May', performance: 90 },
  { month: 'Jun', performance: 88 },
];

const workoutDistribution = [
  { name: 'Strength', value: 35 },
  { name: 'Cardio', value: 25 },
  { name: 'Recovery', value: 20 },
  { name: 'Flexibility', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const newsData = [
  {
    title: 'Top Athletes Share Their Training Secrets',
    link: '#',
  },
  {
    title: 'Nutrition Tips for Peak Performance',
    link: '#',
  },
  {
    title: 'How Sleep Affects Muscle Recovery',
    link: '#',
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
    // Fetch data here if needed
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto grid grid-cols-12 gap-6">
      {/* Nutrition Section */}
      <div className="col-span-12">
        <NutritionPlan />
      </div>

      {/* Main Content */}
      <div className="col-span-9">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Workouts</p>
                <h3 className="text-2xl font-bold">{stats.totalWorkouts}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <h3 className="text-2xl font-bold">{stats.avgPerformance}%</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <h3 className="text-2xl font-bold">{stats.achievements}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ranking</p>
                <h3 className="text-2xl font-bold">{stats.ranking}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="performance"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Workout Distribution</h3>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workoutDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {workoutDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="col-span-3">
        <h2 className="text-2xl font-bold mb-4">Athlete News</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <ul className="space-y-4">
            {newsData.map((newsItem, index) => (
              <li key={index}>
                <a href={newsItem.link} className="text-blue-600 hover:underline">
                  {newsItem.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
