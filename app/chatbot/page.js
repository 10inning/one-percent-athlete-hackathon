"use client";

import { useState } from "react";
import { useUser } from "../context/userContext";
import { getAIResponse } from "/app/openaihelper.js";
import "./chatBot.css";
import Sidebar from "../Components/Sidebar";

const Chatbot = () => {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Stores user and assistant messages
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");

  // Function to handle sending messages
  const handleAsk = async () => {
    if (!user) {
      alert("Please sign in to use the chatbot.");
      return;
    }

    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }

    setError("");
    setIsTyping(true);

    const userMessage = { sender: "user", text: message };
    setChatHistory((prevHistory) => [...prevHistory, userMessage]);

    try {
      const aiResponse = await getAIResponse(user.id, message);
      const assistantMessage = { sender: "assistant", text: formatResponse(aiResponse) };
      setChatHistory((prevHistory) => [...prevHistory, assistantMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setError("Failed to get a response. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  // Function to format AI responses
  const formatResponse = (text) => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Check for numbered lists (e.g., "1. ", "2. ")
      if (/^\d+\.\s/.test(trimmedLine)) {
        return (
          <p key={index}>
            <strong>{trimmedLine.split(".")[0]}.</strong>{" "}
            {convertMarkdownToHTML(trimmedLine.slice(trimmedLine.indexOf(".") + 1).trim())}
          </p>
        );
      }

      // Check for bold Markdown (**bold text**)
      return (
        <p key={index}>{convertMarkdownToHTML(trimmedLine)}</p>
      );
    });
  };

  // Convert Markdown-like text to HTML
  const convertMarkdownToHTML = (text) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(boldRegex);

    return parts.map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };

  return (
    <div className="chatBotContainer">
      <Sidebar />
      <div style={{ width: "100%", height: "100vh", overflow: "auto" }}>
        <div
          style={{ width: "100%", padding: "20px", height: "85%", overflow: "auto" }}
          className="aiChatMessagesContainer"
        >
          {chatHistory.map((entry, index) => (
            <div
              key={index}
              style={{
                padding: "20px",
                borderRadius: "20px",
                marginBottom: "20px",
                maxWidth: "80%",
                backdropFilter: "blur(15px)",
                backgroundColor:
                  entry.sender === "user" ? "rgba(209, 231, 221, 0.623)" : "rgba(43, 46, 54, 0.623)",
                alignSelf: entry.sender === "user" ? "flex-end" : "flex-start",
              }}
              className={entry.sender === "user" ? "userMessage" : "aiMessage"}
            >
              <p
                style={{
                  marginLeft: entry.sender === "assistant" ? "40px" : "0px",
                  fontSize: "30px",
                  fontWeight: 300,
                  letterSpacing: 1,
                }}
              >
                {entry.sender === "assistant" ? entry.text : entry.text}
              </p>
            </div>
          ))}
          {isTyping && (
            <p style={{ fontStyle: "italic", color: "#555" }}>AI is typing...</p>
          )}
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
