import { ReactNode, createContext, useEffect, useState } from "react";

export const ConversationContext = createContext<any>(undefined)

interface ConversationContextProps {
  children: ReactNode;
}

export const ConversationContextProvider: React.FC<ConversationContextProps> = ({ children }) => {
  const [currentChat, setCurrentChat] = useState();


  return (
    <ConversationContext.Provider
      value={{
        currentChat,
        setCurrentChat
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
