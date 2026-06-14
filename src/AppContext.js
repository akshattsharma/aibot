import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [conversations, setConversations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('conversations') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  const saveConversation = (messages, feedback) => {
    const conv = {
      id: Date.now(),
      title: messages.find(m => m.role === 'user')?.text?.slice(0, 40) || 'Conversation',
      date: new Date().toLocaleString(),
      messages,
      feedback,
    };
    setConversations(prev => {
      const updated = [conv, ...prev];
      localStorage.setItem('conversations', JSON.stringify(updated));
      return updated;
    });
    return conv.id;
  };

  return (
    <AppContext.Provider value={{ conversations, saveConversation }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);