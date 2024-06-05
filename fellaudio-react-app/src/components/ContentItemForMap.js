import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import '../styles/ContentItemForMap.css'
import { formatDurationTime } from '../utils/timeFormat';

function ContentItemForMap({ image, name, location, time }) {
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

export default ContentItemForMap;