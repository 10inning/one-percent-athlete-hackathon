'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '@/store/userAuth';


// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});



interface Message {
  content: string;
  sender: 'user' | 'bot';
}

type ChatMode = 'nutrition' | 'fitness' | 'general';

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

  const startNewChat = async () => {
    if (!token) return;
  
    try {
      setIsLoading(true);
      console.log('Making request to:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/start`);
      
      const response = await api.post('/start', null, {
        params: { mode },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data);
      
      // Extract session_id from the response object
      setSessionId(response.data.session_id);
      
      setMessages([{
        content: `Welcome to your ${mode} assistant! How can I help you today?`,
        sender: 'bot'
      }]);
    } catch (error) {
      console.error('Error starting chat:', error);
      // Log more detailed error information
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Headers:', error.response?.headers);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !sessionId || isLoading || !token) return;

    const newMessage: Message = { content: input, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post(`/api/message/${sessionId}`, null, {
        params: { message: input },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessages(prev => [...prev, { content: response.data, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        content: 'Sorry, there was an error processing your message.',
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
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
    <div className="h-full flex flex-col bg-white shadow-lg rounded-lg">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
          <p className="text-sm text-gray-500">Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}</p>
        </div>
        <div className="flex space-x-2">
          {['general', 'nutrition', 'fitness'].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m as ChatMode);
                setMessages([]);
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                mode === m 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                <MessageSquare className="h-4 w-4 text-indigo-600" />
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center ml-2">
                <span className="text-white text-sm">You</span>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] rounded-lg px-4 py-2 bg-gray-100">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 py-2 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}