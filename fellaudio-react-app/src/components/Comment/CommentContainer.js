import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../../styles/CommentContainer.css'

import ProfileDummyImage from '../../assets/profile-dummy.jpg'
import { formatDateTimeIntoAgoDate } from '../../utils/timeFormat';

function CommentBlock({comment}) {
    const navigate = useNavigate()

    const handleCommentClick = (userId) => {
      if(userId !== undefined)
        navigate(`/profile/${userId}`)
    }

  return (
    <div className="commentBlock">
        <div className="commentLeftSide" >
            <img className='profileImageSmall' src={ProfileDummyImage} alt='User Profile Image' onClick={() => handleCommentClick(comment.user?.id)}/>
        </div>
        <div className="commentRightSide">
            <div className="commentHeader" onClick={() => handleCommentClick(comment.user?.id)}>
                <span>{comment.user ? comment.user.firstname : 'Deleted User'} {comment.user?.lastname}</span>
                <span className="commentDate">{
                    comment.user?.createdAt ? formatDateTimeIntoAgoDate(comment.user?.createdAt) : ''
                }
                </span>
            </div>
            <div className="commentBody">
              {comment.text}
            </div>
        </div>
    </div> 
  )
}

export default CommentBlock
