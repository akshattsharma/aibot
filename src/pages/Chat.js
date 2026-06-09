import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SaveModal from '../components/SaveModal';
import { useApp } from '../AppContext';
import botData from '../botData';

function getAnswer(question) {
  const q = question.toLowerCase().trim();
  const match = botData.find(item =>
    item.question.toLowerCase().includes(q) || q.includes(item.question.toLowerCase().replace('?', '').trim())
  );
  return match ? match.answer : "Sorry, Did not understand your query!";
}

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [thumbs, setThumbs] = useState({}); // { msgId: 'like' | 'dislike' }
  const chatEndRef = useRef(null);
  const { saveConversation } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: input.trim() };
    const botMsg = { id: Date.now() + 1, role: 'bot', text: getAnswer(input.trim()) };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleThumb = (msgId, type) => {
    setThumbs(prev => ({
      ...prev,
      [msgId]: prev[msgId] === type ? null : type,
    }));
  };

  const handleSave = (feedback) => {
    // Attach thumbs feedback to messages
    const msgsWithFeedback = messages.map(m => ({
      ...m,
      thumb: thumbs[m.id] || null,
    }));
    saveConversation(msgsWithFeedback, feedback);
    setShowSaveModal(false);
    setMessages([]);
    setThumbs({});
    navigate('/history');
  };

  const handleNewChat = () => {
    setMessages([]);
    setThumbs({});
    setInput('');
  };

  return (
    <div className="app-layout">
      <Sidebar
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-content">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
            <h1>
              <span>Soul AI</span>
            </h1>
          </div>
          <div className="topbar-actions">
            {messages.length > 0 && (
              <button
                className="topbar-btn primary"
                type="button"
                onClick={() => setShowSaveModal(true)}
              >
                Save Chat
              </button>
            )}
          </div>
        </div>

        <div className="chat-area">
          {messages.length === 0 && (
            <div style={{ margin: 'auto', textAlign: 'center', color: '#9aa0b4' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 8, color: '#eaeaea' }}>
                How can I help you today?
              </h2>
              <p style={{ fontSize: '0.9rem' }}>
                Ask me anything about AI, machine learning, and more.
              </p>
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`message-row ${msg.role}`}
            >
              <div className={`avatar ${msg.role}`}>
                {msg.role === 'bot' ? 'AI' : 'U'}
              </div>
              <div className="message-body">
                <div className="message-name">
                  {msg.role === 'bot' ? <span>Soul AI</span> : 'You'}
                </div>
                {msg.role === 'bot' ? (
                  <div className="bubble-wrap">
                    <div className="bubble bot">
                      <p>{msg.text}</p>
                    </div>
                    <div className="thumb-actions">
                      <button
                        className={`thumb-btn ${thumbs[msg.id] === 'like' ? 'active-like' : ''}`}
                        onClick={() => handleThumb(msg.id, 'like')}
                        title="Like"
                      >👍</button>
                      <button
                        className={`thumb-btn ${thumbs[msg.id] === 'dislike' ? 'active-dislike' : ''}`}
                        onClick={() => handleThumb(msg.id, 'dislike')}
                        title="Dislike"
                      >👎</button>
                    </div>
                  </div>
                ) : (
                  <div className="bubble user">
                    <p>{msg.text}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} style={{ height: 40 }} />
        </div>

        <div className="chat-input-area">
          <form className="chat-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Message Bot AI…"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="ask-btn">Ask</button>
          </form>
        </div>
      </div>

      {showSaveModal && (
        <SaveModal
          onSave={handleSave}
          onCancel={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}

export default Chat;