import React, { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ContentContainer from '../components/ContentContainer'
import { FillContentWithImages } from '../utils/tempUtil'
import '../styles/Playlist.css'
import { formatDateTimeIntoDate } from '../utils/timeFormat'

const ApiUrl = process.env.REACT_APP_API_URL

function Playlist() {
    const [contents, setContents] = useState([])
    const [playlist, setPlaylist] = useState([])
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    
    const abortControllerRef = useRef(null)
    const { playlistId } = useParams()

    useEffect(() => {
        const fetchContents = async () => {
          abortControllerRef.current?.abort()
          abortControllerRef.current = new AbortController()
    
          setIsLoading(true)
          
          try {
            const playlistResponse = await fetch(`${ApiUrl}/Playlist/${playlistId}`, {
                signal: abortControllerRef.current.signal
              })
            const playlistData = playlistResponse.json()
            
            const contentResponse = await fetch(`${ApiUrl}/Playlist/${playlistId}/content`, {
              signal: abortControllerRef.current.signal
            })
            const contentsData = await contentResponse.json()
            FillContentWithImages(contentsData)
            console.log(contentsData)
            setPlaylist(playlistData)
            console.log("a:", playlist)
            setContents(contentsData)
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
      }, [playlistId])  
    
      if (isLoading) {
        return <div>Loading...</div>
      }
    
      if (error) {
        return <div>Something went wrong. Please try again</div>
      }
    
  return (
    <div className='playlist'>
      <div className='playlistData'>
        <div className='firstRow'>
            <div className='leftSide'>
                <h1 className='playlistTitle'>Name</h1>
                <p className='playlistAuthor'>імєя пріхвище</p>
            </div>
            <div className='rightSide'>
                <p>Створено {formatDateTimeIntoDate("2024-03-27T19:00:46.7244978")}</p>
            </div>
        </div>
        <div className='secondRow'>
            <p className='playlistDescription'>Description</p>
        </div>
      </div>
      <hr className="solid" />
      <ContentContainer 
        contents={contents}
      />
    </div>
  )
}

export default Playlist
