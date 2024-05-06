import React, {useState} from 'react';
import '../styles/Test.css';
import { ContentList } from '../helpers/contentList';
import Waveform from "../components/Waveform";
import { audioList } from '../helpers/audioList'
import Audio from '../assets/stus.m4a'

function Content() {


  return (
    <div className="App">
      <Waveform url="../assets/stus.m4a" />
    </div>
  );
}

export default Content;
