import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';

function Sidebar({ onNewChat, isOpen, onClose }) {
  const { conversations } = useApp();
  const navigate = useNavigate();

  return (
    <>
      {isOpen && (
        <div
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:99 }}
          onClick={onClose}
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2>Bot <span>AI</span></h2>
        </div>
        <nav className="sidebar-nav">
          <button className="new-chat-btn" onClick={() => { onNewChat(); onClose(); }}>
            + New Chat
          </button>

          <div className="sidebar-section-title">Navigation</div>
          <Link to="/" className="sidebar-nav-link" onClick={onClose}>💬 Chat</Link>
          <Link to="/history" className="sidebar-nav-link" onClick={onClose}>🕐 Past Conversations</Link>
          <Link to="/feedback" className="sidebar-nav-link" onClick={onClose}>⭐ All Feedback</Link>

          {conversations.length > 0 && (
            <>
              <div className="sidebar-section-title" style={{ marginTop: 16 }}>Recent</div>
              {conversations.slice(0, 8).map(c => (
                <button
                  key={c.id}
                  className="history-item"
                  onClick={() => { navigate('/history'); onClose(); }}
                  title={c.title}
                >
                  {c.title}
                </button>
              ))}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;