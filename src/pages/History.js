import React, { useState } from 'react';
import { useApp } from '../AppContext';

function History() {
  const { conversations } = useApp();
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

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
        </nav>
      </aside>

      <div className="main-content" style={{ overflowY: 'auto' }}>
        <header className="topbar">
          <h1>Bot AI</h1>
          <a href="/" className="back-btn">← Back to Chat</a>
        </header>

        <div className="page-wrap">
          <h2 style={{ marginBottom: 24, fontSize: '1.3rem' }}>Past Conversations</h2>
          {conversations.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>💬</div>
              <p>No saved conversations yet.</p>
            </div>
          ) : (
            conversations.map(conv => (
              <div className="conv-card" key={conv.id}>
                <div className="conv-card-header" onClick={() => toggle(conv.id)}>
                  <div>
                    <h3>{conv.title}…</h3>
                    <div className="conv-meta" style={{ marginTop: 4 }}>
                      <span>{conv.date}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {conv.feedback?.rating > 0 && (
                      <span className="rating-badge">★ {conv.feedback.rating}/5</span>
                    )}
                    <span style={{ color: '#9aa0b4' }}>{expanded[conv.id] ? '▲' : '▼'}</span>
                  </div>
                </div>
                {expanded[conv.id] && (
                  <div className="conv-body">
                    {conv.messages.map((msg, i) =>
                      msg.role === 'user' ? (
                        <div className="conv-msg" key={i}>
                          <div className="conv-msg-q">You: {msg.text}</div>
                          {conv.messages[i + 1]?.role === 'bot' && (
                            <div className="conv-msg-a">
                              Soul AI: {conv.messages[i + 1].text}
                              {conv.messages[i + 1].thumb && (
                                <span style={{ marginLeft: 8 }}>
                                  {conv.messages[i + 1].thumb === 'like' ? '👍' : '👎'}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : null
                    )}
                    {(conv.feedback?.rating > 0 || conv.feedback?.comment) && (
                      <div className="conv-feedback">
                        <div className="conv-feedback-title">Feedback</div>
                        {conv.feedback.rating > 0 && (
                          <div style={{ color: '#f59e0b', marginBottom: 6 }}>
                            {'★'.repeat(conv.feedback.rating)}{'☆'.repeat(5 - conv.feedback.rating)}
                          </div>
                        )}
                        {conv.feedback.comment && (
                          <div style={{ fontSize: '0.875rem', color: '#9aa0b4' }}>{conv.feedback.comment}</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default History;