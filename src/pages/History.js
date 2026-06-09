import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import Sidebar from '../components/Sidebar';

function History() {
  const { conversations } = useApp();
  const [expanded, setExpanded] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="app-layout">
      <Sidebar onNewChat={() => {}} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content" style={{ overflowY: 'auto' }}>
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
            <h1>Past Conversations</h1>
          </div>
          <Link to="/" className="back-btn">← Back to Chat</Link>
        </div>

        <div className="page-wrap">
          {conversations.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>💬</div>
              <p>No saved conversations yet.</p>
              <p style={{ marginTop: 6 }}>Start a chat and save it to see it here.</p>
            </div>
          ) : (
            conversations.map(conv => (
              <div className="conv-card" key={conv.id}>
                <div className="conv-card-header" onClick={() => toggle(conv.id)}>
                  <div>
                    <h3>{conv.title}…</h3>
                    <div className="conv-meta" style={{ marginTop: 4 }}>
                      <span>{conv.date}</span>
                      <span>{conv.messages.filter(m => m.role === 'user').length} questions</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {conv.feedback?.rating > 0 && (
                      <span className="rating-badge">★ {conv.feedback.rating}/5</span>
                    )}
                    <span style={{ color: '#9aa0b4', fontSize: '0.9rem' }}>
                      {expanded[conv.id] ? '▲' : '▼'}
                    </span>
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
                              <span>Soul AI: </span>{conv.messages[i + 1].text}
                              {conv.messages[i + 1].thumb && (
                                <span style={{ marginLeft: 8, fontSize: '0.8rem' }}>
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
                          <div style={{ fontSize: '0.875rem', color: '#9aa0b4' }}>
                            {conv.feedback.comment}
                          </div>
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