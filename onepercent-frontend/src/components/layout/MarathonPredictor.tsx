import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/store/userAuth";
import { FaRunning } from "react-icons/fa";

const MarathonPredictor = () => {
  const [km4week, setKm4week] = useState(100);
  const [sp4week, setSp4week] = useState(10);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState("M");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth(); // Access the token from your auth context

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Ensure this is set in your environment variables
  });

  const getCategory = (age, gender) => {
    if (gender === "M") {
      if (age < 40) return "Category_MAM";
      if (age < 45) return "Category_M40";
      if (age < 50) return "Category_M45";
      if (age < 55) return "Category_M50";
      return "Category_M55";
    }
    return "Category_WAM";
  };

  const formatTime = (hours) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes.toString().padStart(2, "0")}m`;
  };

  const prepareFeatures = () => {
    const category = getCategory(age, gender);
    const features = new Array(9).fill(0); // Match the required feature length

    features[0] = km4week; // Total distance in last 4 weeks
    features[1] = sp4week; // Average speed
    features[2] = 1.6306; // Some predefined feature value

    const categoryOrder = [
      "Category_M40",
      "Category_M45",
      "Category_M50",
      "Category_M55",
      "Category_MAM",
      "Category_WAM",
    ];
    const categoryIndex = categoryOrder.indexOf(category);

    if (categoryIndex !== -1) {
      features[categoryIndex + 3] = 1; // Offset by 3 due to first three features
    }

    return features;
  };

  const getPrediction = async () => {
    setLoading(true);
    try {
      const features = prepareFeatures();

      const response = await api.post(
        "/ml/marathon/predict",
        features,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { prediction } = response.data;
      setPrediction(prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPrediction();
  }, []); // Run once on mount

  useEffect(() => {
    getPrediction();
  }, [km4week, sp4week, age, gender]); // Trigger on input changes

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8 mt-8">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <FaRunning className="text-blue-500 w-12 h-12" />
        <h1 className="text-2xl font-semibold text-gray-800 ml-4">Marathon Time Predictor</h1>
      </div>

      {/* Prediction Display */}
      <div className="text-center mb-10">
        <div className="text-4xl font-bold">
          {loading ? (
            <span className="text-gray-400">Analyzing...</span>
          ) : (
            <span className="text-blue-600">{prediction ? formatTime(prediction) : "--:--"}</span>
          )}
        </div>
        <p className="text-gray-500 mt-2">Predicted Marathon Completion Time</p>
      </div>

      {/* Input Controls */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Distance (Last 4 Weeks): <span className="text-gray-900 font-semibold">{km4week} km</span>
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={km4week}
            onChange={(e) => setKm4week(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Speed: <span className="text-gray-900 font-semibold">{sp4week} km/h</span>
          </label>
          <input
            type="range"
            min="5"
            max="20"
            step="0.5"
            value={sp4week}
            onChange={(e) => setSp4week(Number(e.target.value))}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default MarathonPredictor;
