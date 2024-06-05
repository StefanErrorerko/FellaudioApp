import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import '../styles/ContentItem.css'
import { formatDurationTime } from '../utils/timeFormat';

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