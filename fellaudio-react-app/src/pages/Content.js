import React from 'react';
import '../styles/Content.css';
import { ContentList } from '../helpers/contentList';

function Content() {
  var content = ContentList[0]; // Assuming you are displaying the first item for now

  return (
    <div className="content">
      <div className="imageContainer">
        <img src={content.image} alt={content.name} className="contentImage" />
      </div>
      <h1>{content.name}</h1>
      <div className="audioBlock">
        {/* Your audio player component */}
      </div>
      <p>{content.description}</p>
      <div className="detailsRow">
        <div className="commentsBlock">
          {/* Your comments component */}
        </div>
        <div className="divider"></div>
        <div className="mapBlock">
          {/* Your map component */}
        </div>
      </div>
    </div>
  );
}

export default Content;
