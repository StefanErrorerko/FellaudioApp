import React, { useEffect, useRef, useState } from "react";
import { amber } from '@mui/material/colors';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom'


import WaveSurfer from "wavesurfer.js";

const formatTime = seconds => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
};

const formWaveSurferOptions = ref => ({
  container: ref,
  waveColor: "#bbb",
  progressColor: "OrangeRed",
  cursorColor: "OrangeRed", 
  dragToSeek: true,
  barAlign: "bottom",
  barWidth: 5,
  barRadius: 0,
  barGap: 1,
  responsive: true,
  height: 120,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true
})

export default function Waveform({ url }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [totalDuration, setTotalDuration] = useState(0); 
  const [currentTime, setCurrentTime] = useState(0); 
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url).then(() => {
        console.log("successfully loaded")
      })
      .catch(error => {
        console.error('Error loading audio file:', error);
      });

    wavesurfer.current.on("ready", () => {
      // make sure object still available when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
    });

    wavesurfer.current.on('interaction', () => {
        //setPlay(!playing)
        //wavesurfer.current.playPause()
      })

    wavesurfer.current.on('decode', (duration) => (setTotalDuration(duration)))
    wavesurfer.current.on('timeupdate', (currentTime) => (setCurrentTime(currentTime)))

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  const togglePopup = (event) => {
    const buttonRect = event.target.getBoundingClientRect();
    const popupWidth = 200; // Adjust as needed
    const popupHeight = 100; // Adjust as needed
    const popupX = buttonRect.left - popupWidth / 2 + buttonRect.width / 2;
    const popupY = buttonRect.top + buttonRect.height + 10; // Adjust vertical spacing as needed
    setPopupPosition({ x: popupX, y: popupY });
    setPopupVisible(!popupVisible);
  };
  

  return (
    <div className="audioBlock">
      <div>
        <button onClick={handlePlayPause}>
          {!playing ? <PlayArrowIcon /> : <PauseIcon />}
        </button>
      </div>
      
      <div id="waveform" ref={waveformRef} >
        <div className="time">{formatTime(currentTime)}</div>
        <div className="duration">{formatTime(totalDuration)}</div>
        <div className="hover"></div>
      </div>
    </div>
  );
}
