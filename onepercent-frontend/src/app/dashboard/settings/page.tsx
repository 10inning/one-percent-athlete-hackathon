'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/store/userAuth';
import { useRouter } from 'next/navigation';
import {
  FaAllergies,
  FaBasketballBall,
  FaHeartbeat,
  FaUtensils,
  FaMapMarkerAlt,
  FaWeight,
  FaRulerVertical,
  FaUser,
  FaTrophy,
  FaMedal,
  FaCalendarAlt,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Tournament {
  id: number;
  name: string;
  date: string;
  result: string;
}

interface UserProfile {
  allergies: string;
  targetSport: string;
  gamePlayed: string;
  dietPreference: string;
  preferredFoods: string;
  healthConditions: string;
  location: string;
  weight: string;
  height: string;
}

const LOCALE_STORAGE_KEY = 'userProfile';

const DEFAULT_BADGES = [
  '/images/badges/badge1.png',
  '/images/badges/badge2.png',
  '/images/badges/badge3.png',
];

const DEFAULT_TOURNAMENTS = [
  { id: 1, name: 'Summer Championship', date: '2023-07-15', result: 'Winner' },
  { id: 2, name: 'City League', date: '2023-09-10', result: 'Runner-Up' },
  { id: 3, name: 'National Finals', date: '2024-03-22', result: 'Participant' },
];

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export default function SettingsPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<UserProfile>({
    allergies: '',
    targetSport: '',
    gamePlayed: '',
    dietPreference: '',
    preferredFoods: '',
    healthConditions: '',
    location: '',
    weight: '',
    height: '',
  });

  const [badges, setBadges] = useState<string[]>(DEFAULT_BADGES);
  const [tournaments, setTournaments] = useState<Tournament[]>(DEFAULT_TOURNAMENTS);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.put('/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(response.data));
        alert('Profile updated successfully!');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/login');
        return;
      }
      
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again later.';
      console.error('Error updating profile:', error);
      alert(errorMessage);
    }
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.status === 200) {
          setFormData(response.data);
          localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(response.data));
          
          if (response.data.badges) {
            setBadges(response.data.badges);
          }
          if (response.data.tournaments) {
            setTournaments(response.data.tournaments);
          }
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push('/login');
          return;
        }
        console.error('Error fetching profile:', error);
      }
    };

    // Try to load from cache first
    const cachedProfile = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (cachedProfile) {
      const parsedProfile = JSON.parse(cachedProfile);
      setFormData(parsedProfile);
      if (parsedProfile.badges) setBadges(parsedProfile.badges);
      if (parsedProfile.tournaments) setTournaments(parsedProfile.tournaments);
    } 
    // If we have a token but no cached data, fetch from API
    else if (token) {
      fetchProfile();
    }
  }, [token, router]);

  // Authentication check
  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [token, loading, router]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!user || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <motion.aside
        className="w-full md:w-1/4 bg-white shadow-md p-6 overflow-y-auto"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.profilePicture || '/images/default-profile.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Badges */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
            <FaMedal className="mr-2 text-yellow-500" /> Earned Badges
          </h3>
          <div className="flex flex-wrap justify-center md:justify-start">
            {badges.map((badge, index) => (
              <img
                key={index}
                src={badge}
                alt={`Badge ${index + 1}`}
                className="w-16 h-16 m-2"
              />
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
            <FaHeartbeat className="mr-2 text-red-500" /> Key Metrics
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <FaWeight className="mr-2 text-gray-500" />
              <span>Weight: {formData.weight || 'N/A'} kg</span>
            </li>
            <li className="flex items-center">
              <FaRulerVertical className="mr-2 text-gray-500" />
              <span>Height: {formData.height || 'N/A'} cm</span>
            </li>
          </ul>
        </div>

        {/* Previous Tournaments */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
            <FaTrophy className="mr-2 text-green-500" /> Previous Tournaments
          </h3>
          <ul className="space-y-2">
            {tournaments.map((tournament) => (
              <li key={tournament.id} className="flex items-center">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                <div>
                  <span className="font-semibold">{tournament.name}</span>
                  <br />
                  <span className="text-sm text-gray-500">
                    {new Date(tournament.date).toLocaleDateString()} - {tournament.result}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        className="w-full md:w-3/4 p-6 overflow-y-auto"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-8">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800 flex items-center">
            <FaUser className="mr-2 text-blue-600" />
            Update Your Profile
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="mb-6">
              <h2 className="text-xl font-medium text-gray-700 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Allergies */}
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaAllergies className="mr-2 text-gray-500" />
                    Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Peanuts, Shellfish"
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaMapMarkerAlt className="mr-2 text-gray-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., New York, USA"
                  />
                </div>

                {/* Weight */}
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaWeight className="mr-2 text-gray-500" />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 70"
                    min="0"
                    step="0.1"
                  />
                </div>

                {/* Height */}
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaRulerVertical className="mr-2 text-gray-500" />
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 175"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="mb-6">
              <h2 className="text-xl font-medium text-gray-700 mb-4">Health Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Health Conditions */}
                <div className="flex flex-col md:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaHeartbeat className="mr-2 text-gray-500" />
                    Health Conditions
                  </label>
                  <input
                    type="text"
                    name="healthConditions"
                    value={formData.healthConditions}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Asthma, Diabetes"
                  />
                </div>
              </div>
            </div>

            {/* Sport Preferences */}
            <div className="mb-6">
              <h2 className="text-xl font-medium text-gray-700 mb-4">Sport Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target Sport */}
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaBasketballBall className="mr-2 text-gray-500" />
                    Target Sport
                  </label>
                  <input
                    type="text"
                    name="targetSport"
                    value={formData.targetSport}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Basketball, Soccer"
                  />
                </div>

                {/* Game Played */}
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaHeartbeat className="mr-2 text-gray-500" />
                    Game Played
                  </label>
                  <input
                    type="text"
                    name="gamePlayed"
                    value={formData.gamePlayed}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 3-on-3 Basketball"
                  />
                </div>

                {/* Diet Preference */}
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaUtensils className="mr-2 text-gray-500" />
                    Diet Preference
                  </label>
                  <select
                    name="dietPreference"
                    value={formData.dietPreference}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                {/* Preferred Foods */}
                <div className="flex flex-col md:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaUtensils className="mr-2 text-gray-500" />
                    Preferred Foods
                  </label>
                  <textarea
                    name="preferredFoods"
                    value={formData.preferredFoods}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Grilled Chicken, Salad, Fruits"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </motion.main>
    </div>
  );
}
