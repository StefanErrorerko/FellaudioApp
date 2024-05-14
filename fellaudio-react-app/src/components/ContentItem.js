import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';

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
      <div style={{ backgroundImage: `url(${image})` }}>

      </div>
      <div>
      <h1>{name}</h1>
      <h2><PlaceIcon />{location}</h2>
      <h3><AccessTimeIcon />{formatDurationTime(time)}</h3>
      </div>
    </div>
  );
}

export default ContentItem;