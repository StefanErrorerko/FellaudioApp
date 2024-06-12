import '../../styles/Components.css'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function CommentFormDisabled() {
    return (
      <div className="commentForm" disabled>
        <div className="commentInputContainer" disabled>
            <textarea
                placeholder="Увійдіть у ваш профіль, щоб написати коментар"
                className="commentInput"
                disabled
            />
            <button type="submit" className="commentButton" disabled>
                <ArrowUpwardIcon />
            </button>
        </div>
      </div>
    );
  }

export default CommentFormDisabled
