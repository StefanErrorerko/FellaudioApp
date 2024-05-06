import React, {useState} from 'react';
import '../styles/Content.css';
import { ContentList } from '../helpers/contentList';
import Waveform from "../components/Waveform";
import { audioList } from '../helpers/audioList'
import Audio from '../assets/stus.m4a'

function Content() {
  var content = ContentList[0]; // Assuming you are displaying the first item for now

  const [isPlaying, setIsPlaying] = useState(false)
 
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    const audio = document.getElementById('audio');
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }


  return (
    <div className="content">
      <div className="imageContainer">
        <img src={content.image} alt={content.name} className="contentImage" />
      </div>
      <h1>{content.name}</h1>
      <div className="audioBlock">
        <Waveform url={Audio} />
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
