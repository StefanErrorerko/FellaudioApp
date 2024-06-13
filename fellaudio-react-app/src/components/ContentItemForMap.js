import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import '../styles/ContentItemForMap.css'
import { formatDurationTime } from '../utils/timeFormat';

function ContentItemForMap({ content, isClickable=false }) {
    return (
        <div className={`contentItemLittle ${isClickable && "clickable"}`}>    
          <div className='contentTextLittle'>
            {content.title}
            <div className='contentDataLittle'>
              <div>
                <PlaceIcon />
                <span>{content.area}</span>
              </div>
              {content.audioFile.durationInSeconds && (
                <div>
                  <AccessTimeIcon /> 
                  <span>
                    {formatDurationTime(content.audioFile.durationInSeconds)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
}

export default ContentItemForMap;