import { createContext, useEffect, useState } from "react";

export const DarkModeContext = createContext({});

export const DarkModeContextProvider:React.FC<any> = ({ children }) => {
  const mode =  JSON.parse(localStorage.getItem("darkMode") || '{}')
  const [darkMode, setDarkMode] = useState(mode)


  const toggle = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
};