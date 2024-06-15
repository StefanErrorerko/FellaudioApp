import React, { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ContentContainer from '../../components/ContentContainer'
import { FillContentWithImages } from '../../utils/tempUtil'
import '../../styles/Playlist.css'
import { formatDateTimeIntoDate } from '../../utils/timeFormat'
import FloatingEditButton from '../../components/FloatingEditButton'

const ApiUrl = process.env.REACT_APP_API_URL

function Playlist() {
    const [contents, setContents] = useState([])
    const [playlist, setPlaylist] = useState([])
    const [error, setError] = useState()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [editableName, setEditableName] = useState('')
    const [editableDescription, setEditableDescription] = useState('')
    
    const abortControllerRef = useRef(null)
    const { playlistId } = useParams()

    const handleEditClick = () => {
      if(isEditing)
        saveChanges()

      setIsEditing(!isEditing)
    }

    const saveChanges = async () => {
      try {
        let body = {
          description: editableDescription,
        }
        if(playlist.name !== "Saved")
          body.name = editableName

        const response = await fetch(`${ApiUrl}/Playlist/${playlistId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })

        if (!response.ok) {
          throw new Error('Failed to update playlist')
        }

        window.location.reload();        
      } catch (err) {
        setError(err)
      }
    }

    const deleteContent = async (contentId) => {
      try {
        const response = await fetch(`${ApiUrl}/Playlist/${playlist.id}/content/${contentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status !== 204) {
          throw new Error('Failed to delete content from playlist');
        }
        console.log('Content successfully deleted from playlist');
      } catch (err) {
        if(err.name === 'AbortError'){
          console.log("Aborted")
          return
        }
        setError(err)
      }
    }

    useEffect(() => {
        const fetchContents = async () => {
          abortControllerRef.current?.abort()
          abortControllerRef.current = new AbortController()
    
          setIsLoading(true)
          
          try {
            const playlistResponse = await fetch(`${ApiUrl}/Playlist/${playlistId}`, {
                signal: abortControllerRef.current.signal
              })
            const playlistData = await playlistResponse.json()
            
            const contentResponse = await fetch(`${ApiUrl}/Playlist/${playlistId}/content`, {
              signal: abortControllerRef.current.signal
            })
            const contentsData = await contentResponse.json()
            FillContentWithImages(contentsData)
            console.log(contentsData)
            setPlaylist(playlistData)
            setEditableName(playlistData.name)
            setEditableDescription(playlistData.description)
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
        console.log(error)
        return <div>Something went wrong. Please try again</div>
      }

  return (
    <div className='playlist'>
      <div className='playlistData'>
        <div className='firstRow'>
            <div className='leftSide'>
                <h1 className='playlistTitle'>{playlist.name === "Saved" ? "Вподобане вами" : editableName }</h1>
                <p className='playlistAuthor'>{playlist.user?.firstname} {playlist.user?.lastname}</p>
            </div>
            <div className='rightSide'>
                <p>Створено {formatDateTimeIntoDate(playlist.createdAt)}</p>
            </div>
        </div>
        <div className='secondRow'>
            {isEditing ? (
              <input
                type='text'
                value={editableDescription}
                placeholder='Введіть опис вашого плейлиста'
                onChange={(e) => setEditableDescription(e.target.value)}
                className='playlistDescription'
              />
            ) : (
              <p className='playlistDescription'>{editableDescription}</p>
            )}
        </div>
      </div>
      <hr className="solid" />
      {contents.length === 0 ? (
        <div>Тут ще нічого немає</div>
      ) : (
        <ContentContainer 
          contents={contents}
          isEdited={isEditing}
          playlist={playlist}
          onEditAction={deleteContent}
          showHidden={true}
        />        
      )}

      <FloatingEditButton 
        handleOnClick={handleEditClick}
        isEditing={isEditing}
      />
    </div>
  )
}

export default Playlist
