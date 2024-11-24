import { createContext, useContext, useEffect, useState } from "react";
import { getCookie, deleteCookie } from "cookies-next";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userCookie = getCookie("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
  }, []);

  const logout = () => {
    setUser(null);
    deleteCookie("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
