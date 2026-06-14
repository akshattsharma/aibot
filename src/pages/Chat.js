import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SaveModal from '../components/SaveModal';
import { useApp } from '../AppContext';
import botData from '../botData';

function getAnswer(question) {
  const q = question.toLowerCase().trim();
  const match = botData.find(item =>
    item.question.toLowerCase().includes(q) ||
    q.includes(item.question.toLowerCase().replace('?', '').trim())
  );
  return match ? match.answer : "Sorry, Did not understand your query!";
}

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [thumbs, setThumbs] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const handleSave = (feedback) => {
    const msgsWithFeedback = messages.map(m => ({ ...m, thumb: thumbs[m.id] || null }));
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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:99 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2>Bot <span>AI</span></h2>
        </div>
        <nav className="sidebar-nav">
          <a className="sidebar-nav-link new-chat-link" onClick={handleNewChat} href="#new">New Chat</a>
          <Link to="/history" className="sidebar-nav-link" onClick={() => setSidebarOpen(false)}>
            Past Conversations
          </Link>
          <Link to="/feedback" className="sidebar-nav-link" onClick={() => setSidebarOpen(false)}>
            All Feedback
          </Link>
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
        {/* HEADER */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(v => !v)}>☰</button>
            <h1><span>Soul AI</span></h1>
          </div>
          <div className="topbar-actions">
            <Link to="/history" className="topbar-btn">Past Conversations</Link>
            {messages.length > 0 && (
              <button className="topbar-btn primary" type="button" onClick={() => setShowSaveModal(true)}>
                Save Chat
              </button>
            )}
          </div>
        </header>

        {/* CHAT MESSAGES */}
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
                <div className="message-name">{msg.role === 'bot' ? <span>Soul AI</span> : 'You'}</div>
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

        {/* INPUT */}
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

      {showSaveModal && (
        <SaveModal onSave={handleSave} onCancel={() => setShowSaveModal(false)} />
      )}
    </div>
  );
}

export default Chat;