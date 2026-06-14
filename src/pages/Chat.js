import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import botData from '../botData';

function getAnswer(question) {
  const q = question.toLowerCase().trim().replace('?', '');
  for (const item of botData) {
    const key = item.question.toLowerCase().trim().replace('?', '');
    if (key === q) return item.answer;
  }
  for (const item of botData) {
    const key = item.question.toLowerCase().trim().replace('?', '');
    if (q.includes(key) || key.includes(q)) return item.answer;
  }
  const qWords = q.split(/\s+/).filter(w => w.length > 3);
  for (const item of botData) {
    const key = item.question.toLowerCase().replace('?', '');
    const matches = qWords.filter(w => key.includes(w));
    if (matches.length >= 2) return item.answer;
  }
  return "Sorry, Did not understand your query!";
}

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thumbs, setThumbs] = useState({});
  const chatEndRef = useRef(null);
  const { conversations, saveConversation } = useApp();
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
    setThumbs(prev => ({ ...prev, [msgId]: prev[msgId] === type ? null : type }));
  };

  // Single save button — type="button", saves directly to localStorage, no modal
  const handleSave = () => {
    if (messages.length === 0) return;
    const msgsWithFeedback = messages.map(m => ({ ...m, thumb: thumbs[m.id] || null }));
    saveConversation(msgsWithFeedback, { rating: 0, comment: '' });
    setMessages([]);
    setThumbs({});
    navigate('/history');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Bot <span>AI</span></h2>
        </div>
        <nav className="sidebar-nav">
          <a href="/" className="sidebar-nav-link">New Chat</a>
          <a href="/history" className="sidebar-nav-link">Past Conversations</a>
          <a href="/feedback" className="sidebar-nav-link">All Feedback</a>
          {conversations.length > 0 && (
            <>
              <div className="sidebar-section-title" style={{ marginTop: 16 }}>Recent</div>
              {conversations.slice(0, 8).map(c => (
                <button key={c.id} className="history-item" onClick={() => navigate('/history')} title={c.title}>
                  {c.title}
                </button>
              ))}
            </>
          )}
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <h1>Bot AI</h1>
          <div className="topbar-actions">
            {messages.length > 0 && (
              <button type="button" className="topbar-btn primary" onClick={handleSave}>
                Save
              </button>
            )}
          </div>
        </header>

        <div className="chat-area">
          {messages.length === 0 && (
            <div style={{ margin: 'auto', textAlign: 'center', color: '#9aa0b4' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
              <h2 style={{ fontSize: '1.3rem', marginBottom: 8, color: '#eaeaea' }}>How can I help you today?</h2>
              <p style={{ fontSize: '0.9rem' }}>Ask me anything about AI, machine learning, and more.</p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`message-row ${msg.role}`}>
              <div className={`avatar ${msg.role}`}>{msg.role === 'bot' ? 'AI' : 'U'}</div>
              <div className="message-body">
                <div className="message-name">
                  {msg.role === 'bot' ? <span>Soul AI</span> : 'You'}
                </div>
                {msg.role === 'bot' ? (
                  <div className="bubble-wrap">
                    <div className="bubble bot"><p>{msg.text}</p></div>
                    <div className="thumb-actions">
                      <button className={`thumb-btn ${thumbs[msg.id] === 'like' ? 'active-like' : ''}`} onClick={() => handleThumb(msg.id, 'like')}>👍</button>
                      <button className={`thumb-btn ${thumbs[msg.id] === 'dislike' ? 'active-dislike' : ''}`} onClick={() => handleThumb(msg.id, 'dislike')}>👎</button>
                    </div>
                  </div>
                ) : (
                  <div className="bubble user"><p>{msg.text}</p></div>
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
              placeholder="Message Bot AI..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="ask-btn">Ask</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;