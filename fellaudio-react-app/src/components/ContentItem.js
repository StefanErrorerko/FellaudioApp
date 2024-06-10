import React, { useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import CancelIcon from '@mui/icons-material/Cancel';
import '../styles/ContentItem.css'
import { formatDurationTime } from '../utils/timeFormat';

function ContentItem({ contentId=null, image, name, location, time, isEdited=false, onEditAction=null }) {
  const [isDeleted, setIsDeleted] = useState(false)

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (onEditAction && contentId) {
      onEditAction(contentId);
      setIsDeleted(true)
    }
  }

  return (
    <div className='contentItem'>
      <div className='contentBackground' style={{ backgroundImage: `url(${image})` }}></div>

      <div className='contentText'>
        {name}
        <div className='contentData'>
          <div>
            <PlaceIcon />{location}</div>
          <div><AccessTimeIcon /> {formatDurationTime(time)}</div>
        </div>
      </div>

      {isEdited && !isDeleted &&(
        <button className='deleteButton' onClick={handleDeleteClick}>
        <CancelIcon />
      </button>
      )}

      <div className={`contentDeletedArea ${isDeleted ? "visible" : "hidden"}`}>
        Контент видалено
      </div>
    </div>
  );
}

export default ContentItem;