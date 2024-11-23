"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const UserContext = createContext();

// Provide Context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // To store user data

  // Restore user session from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to use User Context
export const useUser = () => useContext(UserContext);
