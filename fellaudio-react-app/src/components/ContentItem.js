import React from 'react';

function ContentItem({ image, name, location, time }) {
  return (
    <div className='contentItem'>
      <div style={{ backgroundImage: `url(${image})` }}>

      </div>
      <div>
      <h1>{name}</h1>
      <h2>{location}</h2>
      <h3>{time}</h3>
      </div>
    </div>
  );
}

export default ContentItem;
