'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '@/store/userAuth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaGlobe, FaAppleAlt, FaDumbbell } from "react-icons/fa";
// Define interfaces for the API response
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata: any | null;
}

interface ChatSession {
  session_id: string;
  user_id: string;
  mode: 'nutrition' | 'fitness' | 'general';
  messages: ChatMessage[];
  created_at: string;
  last_updated: string;
  context: any;
}

interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

type ChatMode = 'nutrition' | 'fitness' | 'general';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [mode, setMode] = useState<ChatMode>('general');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    if (user) {
      startNewChat();
    }
  }, [mode, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const processChatResponse = (response: any) => {
    // If it's the initial session response
    if (response.session_id && !response.messages) {
      setSessionId(response.session_id);
      setMessages([{
        content: `Welcome to your ${mode} assistant! How can I help you today?`,
        sender: 'bot',
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    // If it's a full chat session response
    if (response.messages?.length > 0) {
      const processedMessages = response.messages.map((msg: ChatMessage): Message => ({
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'bot',
        timestamp: msg.timestamp
      }));
      setMessages(processedMessages);
      setSessionId(response.session_id);
    }
  };

  const startNewChat = async () => {
    if (!token) return;
  
    try {
      setIsLoading(true);
      const response = await api.post('/start', null, {
        params: { mode },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      processChatResponse(response.data);
    } catch (error) {
      console.error('Error starting chat:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
      }
      setMessages([{
        content: 'Sorry, there was an error starting the chat. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !sessionId || isLoading || !token) return;

    const userMessage: Message = { 
      content: input, 
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Optimistically add user message
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post(`/message/${sessionId}`, null, {
        params: { message: currentInput },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Process the response
      if (typeof response.data === 'string') {
        // If the response is just a string (direct message response)
        setMessages(prev => [...prev, {
          content: response.data,
          sender: 'bot',
          timestamp: new Date().toISOString()
        }]);
      } else {
        // If it's a full chat session response
        processChatResponse(response.data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        content: 'Sorry, there was an error processing your message. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-white shadow-lg rounded-lg">
        <p className="text-gray-600">Please sign in to use the chat interface.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 shadow-lg rounded-lg">
  {/* Chat Header */}
  <div className="px-6 py-4 border-b bg-indigo-600 text-white flex items-center justify-between rounded-t-lg">
    <div>
      <h2 className="text-lg font-semibold">AI Assistant</h2>
      <p className="text-sm opacity-90">Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}</p>
    </div>
    <div className="flex space-x-3">
      {[
        { name: 'general', icon: <FaGlobe className="h-5 w-5" /> },
        { name: 'nutrition', icon: <FaAppleAlt className="h-5 w-5" /> },
        { name: 'fitness', icon: <FaDumbbell className="h-5 w-5" /> },
      ].map(({ name, icon }) => (
        <button
          key={name}
          onClick={() => {
            setMode(name as ChatMode); // Set the new mode
            setMessages([]);          // Clear the messages
            setSessionId('');         // Clear the session ID
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            mode === name
              ? 'bg-white text-indigo-600 shadow-md transform scale-105'
              : 'bg-indigo-500 hover:bg-indigo-400 text-white'
          }`}
        >
          {icon}
          <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
        </button>
      ))}
    </div>
  </div>

  {/* Messages */}
  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        {message.sender === 'bot' && (
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-2 shadow-sm">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
          </div>
        )}
        <div className="flex flex-col">
          <div
            className={`max-w-[70%] rounded-xl px-4 py-3 shadow-sm ${
              message.sender === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
          <span className="text-xs text-gray-500 mt-2">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        {message.sender === 'user' && (
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center ml-2 shadow-sm">
            <span className="text-white text-sm font-bold">You</span>
          </div>
        )}
      </div>
    ))}
    {isLoading && (
      <div className="flex justify-start">
        <div className="max-w-[70%] rounded-lg px-4 py-2 bg-gray-100 flex items-center shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
        </div>
      </div>
    )}
    <div ref={messagesEndRef} />
  </div>

  {/* Message Input */}
  <div className="p-4 border-t bg-gray-100 rounded-b-lg">
    <div className="flex items-center space-x-2">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        rows={1}
        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-sm"
      />
      <button
        onClick={sendMessage}
        disabled={isLoading || !input.trim()}
        className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </button>
    </div>
    <p className="text-xs text-gray-500 mt-3">
      Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for a new line.
    </p>
  </div>
</div>

  
  );
}