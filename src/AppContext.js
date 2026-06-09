import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [conversations, setConversations] = useState([]);

  const saveConversation = (messages, feedback) => {
    const conv = {
      id: Date.now(),
      title: messages[0]?.text?.slice(0, 40) || 'Conversation',
      date: new Date().toLocaleString(),
      messages,
      feedback,
    };
    setConversations(prev => [conv, ...prev]);
    return conv.id;
  };

  return (
    <AppContext.Provider value={{ conversations, saveConversation }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);