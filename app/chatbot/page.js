"use client";

import { useState } from "react";
import { useUser } from "../context/userContext";
import { getAIResponse } from "/app/openaihelper.js";
import "./chatBot.css";
import Sidebar from "../Components/Sidebar";

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
    <div className="chatBotContainer">
      {/* <h1>AI Fitness Coach</h1>
      <textarea
        placeholder="Ask your fitness question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleAsk}>Ask</button>
      <p>AI Response: {response}</p> */}
      <Sidebar />
      <div
        style={{
          width: "100%",
          height: "100vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "20px",
            height: "85%",
            overflow: "auto",
          }}
          className="aiChatMessagesContainer"
        >
          <div
            style={{
              padding: "20px",
              borderRadius: "20px",
              marginBottom: "20px",
              maxWidth: "80%",
              backdropFilter: "blur(15px)",
              backgroundColor: "rgba(43, 46, 54, 0.623)",
            }}
            className="aiMessage"
          >
            <svg
              style={{ fontSize: "40px" }}
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 21.52l-4.5 2.597L52.934 138.76v234.48L256 490.48l203.066-117.24V138.76L256 21.52zm0 20.783l185.066 106.85v213.695L256 469.698 70.934 362.847V149.152L256 42.302zm0 30.93l-4.5 2.597-153.78 88.785v182.77L256 438.768l158.28-91.383v-182.77L256 73.232zm0 20.783l140.28 80.992v161.984L256 417.984l-140.28-80.992V175.008L256 94.016zm0 30.93l-4.5 2.597-108.998 62.93v131.054L256 387.055l113.498-65.528V190.473L256 124.945zm0 20.783l95.498 55.135v110.27L256 366.27l-95.498-55.135v-110.27L256 145.73zm0 30.928l-4.5 2.598-64.213 37.072v79.344L256 335.342l68.713-39.67v-79.344L256 176.658zm0 20.783l50.713 29.28v58.56L256 314.56l-50.713-29.28v-58.56L256 197.44zm0 30.93l-4.5 2.6-19.428 11.216v27.628L256 283.63l23.928-13.816v-27.628L256 228.37z"></path>
            </svg>
            <p
              style={{
                marginLeft: "40px",
                fontSize: "30px",
                fontWeight: 300,
                letterSpacing: 1,
              }}
            >
              Hey there! I am Coach Ted Lasso, your personal AI coach. What
              brings you here today?
            </p>
          </div>
          <div
            style={{
              padding: "20px",
              borderRadius: "20px",
              marginBottom: "20px",
              maxWidth: "80%",
              backdropFilter: "blur(15px)",
              backgroundColor: "rgba(43, 46, 54, 0.623)",
            }}
            className="aiMessage"
          >
            <svg
              style={{ fontSize: "40px" }}
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 21.52l-4.5 2.597L52.934 138.76v234.48L256 490.48l203.066-117.24V138.76L256 21.52zm0 20.783l185.066 106.85v213.695L256 469.698 70.934 362.847V149.152L256 42.302zm0 30.93l-4.5 2.597-153.78 88.785v182.77L256 438.768l158.28-91.383v-182.77L256 73.232zm0 20.783l140.28 80.992v161.984L256 417.984l-140.28-80.992V175.008L256 94.016zm0 30.93l-4.5 2.597-108.998 62.93v131.054L256 387.055l113.498-65.528V190.473L256 124.945zm0 20.783l95.498 55.135v110.27L256 366.27l-95.498-55.135v-110.27L256 145.73zm0 30.928l-4.5 2.598-64.213 37.072v79.344L256 335.342l68.713-39.67v-79.344L256 176.658zm0 20.783l50.713 29.28v58.56L256 314.56l-50.713-29.28v-58.56L256 197.44zm0 30.93l-4.5 2.6-19.428 11.216v27.628L256 283.63l23.928-13.816v-27.628L256 228.37z"></path>
            </svg>
            <p
              style={{
                marginLeft: "40px",
                fontSize: "30px",
                fontWeight: 300,
                letterSpacing: 1,
              }}
            >
              {response}
            </p>
          </div>
        </div>
        <div className="aiChatInput">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Chat With AI Coach..."
            name=""
            id=""
          />
          <button
          onClick={handleAsk}
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              right: 30,
              top: 27,
            }}
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
