import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const STORAGE_KEY = 'conversations';

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function AppProvider({ children }) {
  const [conversations, setConversations] = useState(loadFromStorage);

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
      saveToStorage(updated);
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