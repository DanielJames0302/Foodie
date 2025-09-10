import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext<any>(undefined);

export const AuthContextProvider: React.FC<any> = ({ children }) => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const [currentUser, setCurrentUser] = useState<any>(
    user != null ? JSON.parse(user) : null
  );
  const [isLoading, setIsLoading] = useState(true);

  const login = async (inputs: any) => {
    const res = await axios.post(
      "http://localhost:8080/api/auth/login",
      inputs,
      {
        withCredentials: true,
      }
    );
    setCurrentUser(res.data);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

 

  useEffect(() => {
    // Check if we have a stored token and user
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
