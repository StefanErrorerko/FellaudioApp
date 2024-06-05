import React from 'react';
import '../styles/PlaylistItem.css'
import FavoriteIcon from '@mui/icons-material/Favorite';


function PlaylistItem({ name, description, type }) {
  return (
    <div className='playlistItem'>
        {type === "Saved" ? (
            <div>
                <FavoriteIcon />
                <h1>Вподобане вами</h1>
            </div>
        ) :(
            <div>
                <h1>{name}</h1>
            </div>
        )}
    </div>
  );
}

export default PlaylistItem;