import React, { useContext, useState, useEffect, useRef } from 'react';
import '../styles/Playlist.css';
import { UserContext } from '../context/UserContext';
import PlaylistContainer from '../components/PlaylistContainer';

const ApiUrl = process.env.REACT_APP_API_URL

function Playlist() {
  const [playlists, setPlaylists] = useState([])
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  
  const abortControllerRef = useRef(null)
  
  const {user} = useContext(UserContext)

  useEffect(() => {
    const fetchContents = async () => {
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      setIsLoading(true)
      
      try {
        const response = await fetch(`${ApiUrl}/User/${user?.id}/playlists`, {
          signal: abortControllerRef.current.signal
        })
        const playlistsData = await response.json()
        console.log("playlistsdata", playlistsData)
        setPlaylists(playlistsData)
      } 
      catch (err) {
        if(err.name === 'AbortError'){
          console.log("Aborted")
          return
        }
        
        setError(err)
      } 
      finally {
        setIsLoading(false)
      }
      
    }

    fetchContents()
  }, [user, isLoading])  

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.log("err", error)
    return <div>Something went wrong. Please try again</div>
  }

  return (
    <div className='playlistContainer'>
      <PlaylistContainer
        playlists ={playlists}
      />
    </div>
  );
}

export default Playlist;