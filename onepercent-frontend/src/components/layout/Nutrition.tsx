import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Save, X, Wand2 } from "lucide-react";
import { useAuth } from "@/store/userAuth";
import DynamicIcon from "@/components/utils/DynamicIcons";
import { FaLeaf } from "react-icons/fa";
import { motion } from "framer-motion";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export default function NutritionPlan() {
  const [mealPlan, setMealPlan] = useState(null);
  const [savedMealPlan, setSavedMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const messageIntervalRef = useRef(null);

  const { token } = useAuth();

  const LOCALE_STORAGE_KEY = "savedMealPlan";

  const loadingMessages = [
    "Customizing for your choices...",
    "Looking for good energy sources...",
    "Balancing nutrients for your sport...",
    "Optimizing your meal plan...",
    "Ensuring variety and taste...",
    "Selecting the best ingredients...",
    "Crafting your personalized plan...",
    "Aligning meals with your goals...",
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
      setCurrentMessage("");
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

  const fetchSavedMealPlan = async () => {
    setLoading(true);
    try {
      const cachedMealPlan = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (cachedMealPlan) {
        const parsedMealPlan = JSON.parse(cachedMealPlan);
        setMealPlan(parsedMealPlan);
        setSavedMealPlan(parsedMealPlan);
      } else {
        const response = await api.get("/get-meal-plan", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMealPlan(response.data);
        setSavedMealPlan(response.data);
        localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      alert("Failed to fetch meal plan. Please try again.");
      setMealPlan(null);
      setSavedMealPlan(null);
      localStorage.removeItem(LOCALE_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedMealPlan();
  }, []);

  const generateMealPlan = async () => {
    setLoading(true);
    setHasGenerated(false);

    try {
      const response = await api.post(
        "/generate-meal-plan",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMealPlan(response.data);
      setHasGenerated(true);
      localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(response.data));
    } catch (error) {
      console.error("Error generating meal plan:", error);
      alert("Failed to generate meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveMealPlan = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        "/save-meal-plan",
        mealPlan,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSavedMealPlan(response.data);
      setHasGenerated(false);
      localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(response.data));
    } catch (error) {
      console.error("Error saving meal plan:", error);
      alert("Failed to save meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetMealPlan = () => {
    if (savedMealPlan) {
      setMealPlan(savedMealPlan);
      setHasGenerated(false);
      localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(savedMealPlan));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
            <FaLeaf className="text-green-600" />
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

        <div className="bg-white p-4 rounded-xl shadow-sm text-center mb-6 border border-gray-200">
  <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
    Total Calories:{" "}
    <span className="text-red-600 font-medium">
      {mealPlan.meal_plan.reduce(
        (total, meal) => total + meal.calories,
        0
      )}{" "}
      kcal
    </span>
  </h2>
</div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {mealPlan.meal_plan.map((meal, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg shadow-sm p-4 mt-6"
            >
              <div className="flex items-center mb-2">
                <DynamicIcon
                  iconName={meal.icon}
                  className="h-5 w-5 text-green-500"
                />
                <h3 className="ml-2 text-md font-medium">{meal.meal}</h3>
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-3">
                Calories:{" "}
                <span className="text-red-500 font-bold">{meal.calories} kcal</span>
              </p>
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
          <div className="mb-2 text-xs text-gray-500 text-center">
            {currentMessage}
          </div>
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
              loading ? "opacity-50 cursor-not-allowed" : ""
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
                {currentMessage || "Generating..."}
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
