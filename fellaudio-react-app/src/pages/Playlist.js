import React from 'react';
import { PlaylistList } from '../helpers/playlistList';
import '../styles/Playlist.css';

function Playlist() {
  return (
    <div className='playlistContainer'>
      {PlaylistList.map((playlist, index) => (
        <div key={index} className='playlistItem'>
          {/* Square icon on the left */}
          <div className='icon'></div>
          {/* Text div on the right */}
          <div className='text'>
            <div className='name'>{playlist.name}</div>
            <div className='description'>{playlist.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Playlist;
