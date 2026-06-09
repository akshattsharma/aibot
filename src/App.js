import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Chat from './pages/Chat';
import History from './pages/History';
import Feedback from './pages/Feedback';
import './App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/history" element={<History />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;