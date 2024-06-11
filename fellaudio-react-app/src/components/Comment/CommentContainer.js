import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../../styles/CommentContainer.css'

import ProfileDummyImage from '../../assets/profile-dummy.jpg'
import { formatDateTimeIntoAgoDate } from '../../utils/timeFormat';
import { FillProfileWithImages } from '../../utils/tempUtil';

function CommentBlock({comment}) {
    const navigate = useNavigate()

    const handleCommentClick = (userId) => {
      if(userId !== undefined)
        navigate(`/profile/${userId}`)
    }

    const userWithImage = comment.user ? FillProfileWithImages([comment.user])[0] : null

  return (
    <div className="commentBlock">
        <div className="commentLeftSide" >
            <img className='profileImageSmall' 
              src={userWithImage && userWithImage.image ? userWithImage.image : ProfileDummyImage} 
              alt='User Profile Image' 
              onClick={() => handleCommentClick(comment.user?.id)}
            />
        </div>
        <div className="commentRightSide">
            <div className="commentHeader" onClick={() => handleCommentClick(comment.user?.id)}>
                <span>{comment.user ? comment.user.firstname : 'Deleted User'} {comment.user?.lastname}</span>
                <span className="commentDate">{
                    comment.user?.createdAt ? formatDateTimeIntoAgoDate(comment.createdAt) : ''
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
