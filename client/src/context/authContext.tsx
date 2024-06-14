import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext<any>(undefined);

export const AuthContextProvider: React.FC<any> = ({ children }) => {
  const user = localStorage.getItem("user");
  const [currentUser, setCurrentUser] = useState<any>(
    user != null ? JSON.parse(user) : null
  );

  const login = async (inputs: any) => {
    const res = await axios.post(
      "http://localhost:8080/api/auth/login",
      inputs,
      {
        withCredentials: true,
      }
    );
    setCurrentUser(res.data);
  };

 

  useEffect(() => {


    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
