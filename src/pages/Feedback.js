import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import Sidebar from '../components/Sidebar';

function Feedback() {
  const { conversations } = useApp();
  const [filter, setFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const withFeedback = conversations.filter(c => c.feedback?.rating > 0 || c.feedback?.comment);

  const filtered = filter === 'all'
    ? withFeedback
    : withFeedback.filter(c => c.feedback?.rating === parseInt(filter));

  return (
    <div className="app-layout">
      <Sidebar onNewChat={() => {}} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content" style={{ overflowY: 'auto' }}>
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
            <h1>All Feedback</h1>
          </div>
          <Link to="/" className="back-btn">← Back to Chat</Link>
        </div>

        <div className="page-wrap">
          <div className="filter-row">
            {['all', '5', '4', '3', '2', '1'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All Ratings' : `${'★'.repeat(parseInt(f))} ${f} Star`}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>⭐</div>
              <p>No feedback found{filter !== 'all' ? ` for ${filter} star rating` : ''}.</p>
            </div>
          ) : (
            filtered.map(conv => (
              <div className="feedback-card" key={conv.id}>
                <div className="feedback-card-top">
                  <div>
                    <h3>{conv.title}…</h3>
                    <div className="feedback-card-date">{conv.date}</div>
                  </div>
                  {conv.feedback?.rating > 0 && (
                    <span className="rating-badge">★ {conv.feedback.rating}/5</span>
                  )}
                </div>

                {conv.feedback?.rating > 0 && (
                  <div style={{ color: '#f59e0b', fontSize: '1.1rem' }}>
                    {'★'.repeat(conv.feedback.rating)}
                    <span style={{ color: '#4a5568' }}>{'★'.repeat(5 - conv.feedback.rating)}</span>
                  </div>
                )}

                {conv.feedback?.comment && (
                  <div className="feedback-card-comment">"{conv.feedback.comment}"</div>
                )}

                <div style={{ marginTop: 12, fontSize: '0.78rem', color: '#9aa0b4' }}>
                  {conv.messages.filter(m => m.role === 'user').length} messages
                  {conv.messages.some(m => m.thumb) && (
                    <span style={{ marginLeft: 12 }}>
                      👍 {conv.messages.filter(m => m.thumb === 'like').length}
                      &nbsp;&nbsp;
                      👎 {conv.messages.filter(m => m.thumb === 'dislike').length}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Feedback;