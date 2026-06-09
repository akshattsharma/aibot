import React, { useState } from 'react';

function SaveModal({ onSave, onCancel }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');

  const handleSave = () => {
    onSave({ rating, comment });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Save Conversation</h2>
        <p>Rate this conversation and leave optional feedback before saving.</p>

        <div style={{ marginBottom: 8, fontSize: '0.8rem', color: '#9aa0b4', fontWeight: 600 }}>
          RATING
        </div>
        <div className="rating-row">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              className={`star-btn ${star <= (hovered || rating) ? 'filled' : ''}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`Rate ${star} stars`}
            >
              ★
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 8, fontSize: '0.8rem', color: '#9aa0b4', fontWeight: 600 }}>
          FEEDBACK (OPTIONAL)
        </div>
        <textarea
          className="feedback-textarea"
          placeholder="Share your thoughts about this conversation..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn save" type="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveModal;