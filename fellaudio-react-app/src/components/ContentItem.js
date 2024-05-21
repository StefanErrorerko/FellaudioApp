import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import '../styles/ContentItem.css'

const formatDurationTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600)
  const minutes = Math.floor((timeInSeconds % 3600) / 60)
  if(hours !== 0)
    return `${hours} год ${minutes} хв`

  return `${minutes} хв`
}

function ContentItem({ image, name, location, time }) {
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
    </div>
  );
}

export default ContentItem;