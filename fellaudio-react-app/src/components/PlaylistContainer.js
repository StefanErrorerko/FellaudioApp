import React from 'react'
import { useNavigate } from 'react-router-dom'
import PlaylistItem from './PlaylistItem'

function PlaylistContainer({playlists}) {
    const navigate = useNavigate()

    const handlePlaylistItemClick = (playlistId) => {
        navigate(`/playlist/${playlistId}`)
      }

    return(
        <div className='playlistContainer'>
        {playlists.map((playlistItem, key) => (
          <div onClick={() => handlePlaylistItemClick(playlistItem.id)}>
            <PlaylistItem
              key={key}
              name={playlistItem.name}
              description={playlistItem.description}
              type={playlistItem.type}
            />
          </div>
        ))}
      </div>
    )
}

export default PlaylistContainer
