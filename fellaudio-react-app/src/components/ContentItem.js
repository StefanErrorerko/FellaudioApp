import React, { useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import CancelIcon from '@mui/icons-material/Cancel';
import Done from '@mui/icons-material/Done'
import '../styles/ContentItem.css'
import { formatDurationTime } from '../utils/timeFormat';

function ContentItem({ contentId=null, image, name, location, time, isEdited=false, onEditAction=null, isHidden=false }) {
  const [isDeleted, setIsDeleted] = useState(false)

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (onEditAction && contentId) {
      onEditAction(contentId);
      setIsDeleted(true)
    }
  }

  const handleHideClick = async e => {
    e.stopPropagation();
    if (onEditAction && contentId) {
      onEditAction(contentId);
      setIsDeleted(false)
    }
  }

  return (
    <div className='contentItem'>
      <div className='contentBackground' style={{ backgroundImage: `url(${image})` }}></div>

      <div className='contentText'>
        {name}
        <div className='contentData'>
          <div className='contentLocation'>
            <PlaceIcon />{location}</div>
          { time && <div className='contentDuration'><AccessTimeIcon /> {formatDurationTime(time)}</div>}
        </div>
      </div>

      {isEdited && !isDeleted &&(
        <button className='deleteButton' onClick={handleDeleteClick}>
        <CancelIcon />
      </button>
      )}

      <div className={`contentDeletedArea ${isDeleted || isHidden ? "visible" : "hidden"}`}>
        Контент видалено
      </div>

      {isEdited && isHidden &&(
        <button className='unbanButton' onClick={handleHideClick}>
          <Done />
      </button>
      )}
    </div>
  );
}

export default ContentItem;