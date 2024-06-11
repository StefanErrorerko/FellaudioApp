import React, { useState } from 'react'
import '../../styles/Components.css'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function CommentForm({ onSubmit }) {
    const [text, setText] = useState('');
  
    const handleSubmit = e => {
      e.preventDefault();
      onSubmit(text);
      setText('');
    };
  
    return (
      <form onSubmit={handleSubmit} className="commentForm">
        <div className="commentInputContainer">
            <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Напишіть ваш коментар..."
            className="commentInput"
            />
            <button type="submit" className="commentButton">
            <ArrowUpwardIcon />
            </button>
        </div>
      </form>
    );
  }

export default CommentForm
