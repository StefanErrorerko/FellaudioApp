import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import '../styles/ContentItemLittle.css'

const formatDurationTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600)
  const minutes = Math.floor((timeInSeconds % 3600) / 60)
  if(hours !== 0)
    return `${hours} год ${minutes} хв`

  return `${minutes} хв`
}

function ContentItemLittle({ image, name, location, time }) {
    return (
        <div className='contentItemLittle'>    
          <div className='contentTextLittle'>
            {name}
            <div className='contentDataLittle'>
              <div>
                <PlaceIcon />{location}</div>
              <div><AccessTimeIcon /> {formatDurationTime(time)}</div>
            </div>
          </div>
        </div>
      );
}

export default ContentItemLittle;