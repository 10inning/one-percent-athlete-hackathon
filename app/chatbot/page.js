"use client";

import { useState } from "react";
import { useUser } from "../context/userContext";
import { getAIResponse } from "/app/openaihelper.js";

const Chatbot = () => {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = async () => {
    if (!user) {
      alert("Please sign in to use the chatbot.");
      return;
    }

    try {
      const aiResponse = await getAIResponse(user.id, message); // Pass user ID as context
      setResponse(aiResponse);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <div>
      <h1>AI Fitness Coach</h1>
      <textarea
        placeholder="Ask your fitness question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleAsk}>Ask</button>
      <p>AI Response: {response}</p>
    </div>
  );
};

export default Chatbot;
