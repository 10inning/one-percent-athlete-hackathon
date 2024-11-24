import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Save, X, Wand2 } from 'lucide-react';
import { useAuth } from '@/store/userAuth';
import DynamicIcon from '@/components/utils/DynamicIcons';
import { FaLeaf  } from "react-icons/fa";
import { motion } from "framer-motion";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export default function NutritionPlan() {
  // State to hold the current meal plan displayed
  const [mealPlan, setMealPlan] = useState(null);
  // State to hold the saved meal plan fetched from the API or cache
  const [savedMealPlan, setSavedMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const messageIntervalRef = useRef(null);

  const { token } = useAuth();

  const LOCALE_STORAGE_KEY = 'savedMealPlan';

  const loadingMessages = [
    'Customizing for your choices...',
    'Looking for good energy sources...',
    'Balancing nutrients for your sport...',
    'Optimizing your meal plan...',
    'Ensuring variety and taste...',
    'Selecting the best ingredients...',
    'Crafting your personalized plan...',
    'Aligning meals with your goals...',
  ];

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    return loadingMessages[randomIndex];
  };

  useEffect(() => {
    if (loading) {
      setCurrentMessage(getRandomMessage());
      messageIntervalRef.current = setInterval(() => {
        setCurrentMessage(getRandomMessage());
      }, 3000);
    } else {
      setCurrentMessage('');
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
        messageIntervalRef.current = null;
      }
    }

    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
    };
  }, [loading]);

  // Fetch the saved meal plan from cache or API
  const fetchSavedMealPlan = async () => {
    setLoading(true);
    try {
      // Check if meal plan exists in localStorage
      const cachedMealPlan = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (cachedMealPlan) {
        const parsedMealPlan = JSON.parse(cachedMealPlan);
        setMealPlan(parsedMealPlan);
        setSavedMealPlan(parsedMealPlan);
      } else {
        // If not in cache, fetch from API
        const response = await api.get('/get-meal-plan', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMealPlan(response.data); // Current displayed meal plan
        setSavedMealPlan(response.data); // Saved meal plan
        // Save to localStorage
        localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(response.data));
      }
      // No popup on successful fetch
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      alert('Failed to fetch meal plan. Please try again.');
      setMealPlan(null); // Keep it null to indicate loading state
      setSavedMealPlan(null);
      localStorage.removeItem(LOCALE_STORAGE_KEY); // Clear cache on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedMealPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate a new meal plan
  const generateMealPlan = async () => {
    setLoading(true);
    setHasGenerated(false);

    try {
      const response = await api.post(
        '/generate-meal-plan',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMealPlan(response.data); // Display the new generated meal plan
      setHasGenerated(true);
      // Save the generated meal plan to localStorage as unsaved changes
      localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(response.data));
      // No popup on successful generation
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert('Failed to generate meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save the currently displayed meal plan to the API and update cache
  const saveMealPlan = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        '/save-meal-plan',
        mealPlan, // Send the complete meal plan object including date and uuid
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSavedMealPlan(response.data); // Update the saved meal plan with the new one
      setHasGenerated(false);
      // Update localStorage with the saved meal plan
      localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(response.data));
      // No popup on successful save
    } catch (error) {
      console.error('Error saving meal plan:', error);
      alert('Failed to save meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset to the last saved meal plan
  const resetMealPlan = () => {
    if (savedMealPlan) {
      setMealPlan(savedMealPlan);
      setHasGenerated(false);
      // Update localStorage to reflect the reset
      localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(savedMealPlan));
    }
  };

  // Format the date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Render loading spinner if mealPlan is null (loading state)
  if (mealPlan === null) {
    return (
      <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-md p-6 h-full">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-gray-500">Loading your meal plan...</p>
        </div>
      </div>
    );
  }

  return (
   <div className="flex flex-col justify-between bg-white rounded-lg shadow-md p-3 h-full">
  <div>

    
  <div className="text-center p-6 bg-gradient-to-r from-green-200 via-blue-100 to-purple-200 rounded-lg shadow-lg">
  <motion.h2
    className="text-2xl font-extrabold text-gray-900 flex items-center justify-center gap-2"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    <FaLeaf  className="text-green-600" />
    Eat Right
  </motion.h2>
  {mealPlan.date && (
    <motion.p
      className="text-sm text-gray-700 mt-3 italic"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
    >
      {formatDate(mealPlan.date)}
    </motion.p>
  )}
</div>



    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      {mealPlan.meal_plan.map((meal, index) => (
        <div key={index} className="bg-gray-100 rounded-lg shadow-sm p-4 mt-6">
          <div className="flex items-center mb-2">
            <DynamicIcon iconName={meal.icon} className="h-5 w-5 text-green-500" />
            <h3 className="ml-2 text-md font-medium">{meal.meal}</h3>
          </div>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            {meal.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
  <div className="mt-4 flex flex-col items-center">
    {loading && currentMessage && (
      <div className="mb-2 text-xs text-gray-500 text-center">{currentMessage}</div>
    )}
    <div className="flex justify-center space-x-2">
      {hasGenerated && !loading && (
        <>
          <button
            onClick={resetMealPlan}
            aria-label="Reset Meal Plan"
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center text-sm"
          >
            <X className="h-4 w-4 mr-1" />
            Reset
          </button>
          <button
            onClick={saveMealPlan}
            aria-label="Save Meal Plan"
            className="px-3 py-1 bg-green-400 text-white rounded-md hover:bg-green-500 flex items-center text-sm"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </button>
        </>
      )}
      <button
        onClick={generateMealPlan}
        disabled={loading}
        className={`px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 flex items-center text-sm ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Generate New Meal Plan"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 mr-1 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            {currentMessage || 'Generating...'}
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4 mr-1" />
            Generate
          </>
        )}
      </button>
    </div>
  </div>
</div>

  );
}
