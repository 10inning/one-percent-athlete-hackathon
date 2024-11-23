// components/NutritionPlan.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Save, X, Wand2 } from 'lucide-react'; // Icons used in buttons
import { useAuth } from '@/store/userAuth';
import DynamicIcon from '@/components/utils/DynamicIcons'; // Import the DynamicIcon component

// Create Axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Ensure this environment variable is set
});

export default function NutritionPlan() {
  // Updated initialMealPlan with icon names as strings
  const initialMealPlan = [
    {
      meal: 'Breakfast',
      items: ['🥞 Pancakes with syrup', '🍳 Scrambled eggs'],
      icon: 'Coffee',
    },
    {
      meal: 'Lunch',
      items: ['🍔 Veggie burger', '🥤 Smoothie'],
      icon: 'Utensils',
    },
    {
      meal: 'Dinner',
      items: ['🍝 Pasta with marinara sauce', '🥗 Garden salad'],
      icon: 'Drumstick',
    },
    {
      meal: 'Snacks',
      items: ['🍎 Apple slices', '🥜 Peanut butter'],
      icon: 'Apple',
    },
  ];

  const [mealPlan, setMealPlan] = useState(initialMealPlan);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const messageIntervalRef = useRef(null);

  const { token } = useAuth(); // Destructure token from useAuth hook

  // Define loading messages locally
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

  // Function to get a random message
  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    return loadingMessages[randomIndex];
  };

  // Effect to handle message cycling during loading
  useEffect(() => {
    if (loading) {
      // Initialize with a random message
      setCurrentMessage(getRandomMessage());

      // Set interval to change message every 3 seconds
      messageIntervalRef.current = setInterval(() => {
        setCurrentMessage(getRandomMessage());
      }, 3000);
    } else {
      // Clear message and interval when not loading
      setCurrentMessage('');
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
        messageIntervalRef.current = null;
      }
    }

    // Cleanup on unmount or when loading changes
    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
    };
  }, [loading]);

  // Function to generate a new meal plan via API
  const generateMealPlan = async () => {
    setLoading(true);
    setHasSaved(false); // Reset saved state on new generation

    try {
      // Replace '/generate-meal-plan' with your actual API endpoint
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

      // Assuming the API returns mealPlan as an array with the same structure
      // Assuming response.data.mealPlan is the meal_plan array from the backend
      const fetchedMealPlan = response.data.mealPlan.map((meal_plan) => ({
        meal: meal_plan.meal,
        items: meal_plan.items,
        icon: meal_plan.icon, // Icon names as strings
      }));

      setMealPlan(fetchedMealPlan);
      setHasGenerated(true);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert('Failed to generate meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to reset to the initial meal plan
  const resetMealPlan = () => {
    setMealPlan(initialMealPlan);
    setHasGenerated(false);
    setHasSaved(false);
  };

  // Function to save the current meal plan
  const saveMealPlan = async () => {
    try {
      // Replace '/save-meal-plan' with your actual API endpoint
      const response = await api.post(
        '/save-meal-plan',
        {
          mealPlan: mealPlan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle response as needed
      alert('Meal plan saved successfully!');
      setHasSaved(true);
    } catch (error) {
      console.error('Error saving meal plan:', error);
      alert('Failed to save meal plan. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white rounded-lg shadow-md p-6 h-full">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center">Today's Nutrition Plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {mealPlan.map((meal, index) => (
            <div key={index} className="bg-gray-100 rounded-lg shadow-sm p-3">
              <div className="flex items-center">
                <DynamicIcon iconName={meal.icon} className="h-6 w-6 text-green-500" />
                <h3 className="ml-3 text-md font-medium">{meal.meal}</h3>
              </div>
              <ul className="mt-2 list-disc list-inside text-gray-600 text-sm">
                {meal.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center">
        {/* Display loading message if loading */}
        {loading && currentMessage && (
          <div className="mb-2 text-center text-xs text-gray-500">{currentMessage}</div>
        )}
        <div className="flex justify-center space-x-3">
          {/* Conditionally render Save and Reset buttons */}
          {hasGenerated && !hasSaved && !loading && (
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
          {/* Generate Button */}
          <button
            onClick={generateMealPlan}
            disabled={loading}
            className={`px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 flex items-center text-sm transition-opacity duration-200 ${
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
                {currentMessage ? currentMessage : 'Generating...'}
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
