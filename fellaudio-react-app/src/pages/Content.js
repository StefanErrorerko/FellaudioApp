import React, {useState, useRef, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Content.css';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DummyImage from '../assets/dummy.jpg'

import Waveform from "../components/Waveform";
import GoogleMap from '../components/Map'
import RecommenderContainer from '../components/RecommenderContainer';
import { UserContext } from '../context/UserContext';
import { FillContentWithImages } from '../utils/tempUtil';
import CommentBlock from '../components/CommentContainer';

const ApiUrl = process.env.REACT_APP_API_URL

function Content() {
  const { contentId } = useParams()
  const {user} = useContext(UserContext)

  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState([])
  const [page, setPage] = useState(0)
  const [firstPoint, setFirstPoint] = useState({
    latitude: 50.15,
    longitude: 30.47
  })
  const [isLiked, setIsLiked] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleLikeClick = async () => {
    setIsLiked(!isLiked)

    try {
      const playlistResponse = await fetch(`${ApiUrl}/User/${user.id}/playlist/saved`)
      const playlistSaved =  await playlistResponse.json()

      if(playlistSaved === null){

        const playlistCreateResponse = await fetch(`${ApiUrl}/Playlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: 'Ваш плейлист вподобаного',
            type: 'Saved',
            userId: user.Id
          })
        })

        playlistSaved = await playlistCreateResponse.json()
      }
      
      const response = await fetch(`${ApiUrl}/Playlist/add/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistId: playlistSaved.id,
          contentId: content.id,
        }),
      })

      if (response.status !== 204) {
        throw new Error('Failed to update playlist')
      }
      
    } catch (err) {
      setError(err)
    }
  }

  const handleDownloadClick = () => {
    setIsDownloaded(!isDownloaded)
  }
  
  const abortControllerRef = useRef(null)

  useEffect(() => {
    const fetchContent = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      
      try {
        const response = await fetch(`${ApiUrl}/Content/${contentId}`, {
          signal: abortControllerRef.current.signal
        });
        const contentData = await response.json();

        const responsePoints = await fetch(`${ApiUrl}/Content/${contentId}/points`);
        const pointsData = await responsePoints.json();
        FillContentWithImages([contentData])
        const sortedPoints = pointsData
        setContent({ ...contentData, points: sortedPoints });

        if (sortedPoints.length > 0) {
          setFirstPoint({
            latitude: sortedPoints[2].location.latitude,
            longitude: sortedPoints[2].location.longitude,
          });
        }
      } 
      catch (err) {
        if (err.name === 'AbortError') {
          console.log("Aborted");
          return;
        }
        
        setError(err);
      } 
      finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);  

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Something went wrong. Please try again</div>
  }

  return (
    <div className="content">
      <div className="imageContainer">
        <img src={content.image ? content.image : DummyImage} alt={content.name} className="contentImage" />
      </div>
      <div className='contentTitleBackground'></div>
      <div className='contentTitle'>
        <h1>{content.title}</h1>
      </div>
      <div className='contentContainer'>
        <div className='contentAudio'>
          <Waveform url="https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3" />
        </div>
        <div className='contentActions'>
          <button className={isDownloaded ? 'clickedButton' : 'unclickedButton'} onClick={() => handleDownloadClick()}>
            {isDownloaded ? (
              <div><ArrowDownwardIcon /><p>Завантажено</p></div>
            ) : (
              <div><ArrowDownwardIcon /><p>Завантажити</p></div>
            )}
          </button>
          <button className={isLiked ? 'clickedButton' : 'unclickedButton'} onClick={() => handleLikeClick()}>
            {isLiked ? (
              <div><FavoriteIcon /><p>Збережено</p></div>
            ) : (
              <div><FavoriteBorderIcon /><p>Зберегти</p></div>
            )}
          </button>
          <button className='unclickedButton'><ShareIcon /><p>Поділитись</p></button>
        </div>
        <div className='contentDescription'>
          <p>{content.description}</p>
        </div>
        <div className="detailsRow">
          <div className="commentsContainer">
          {content.comments?.map((comment, key) => (
             <CommentBlock 
              key={key}
              comment={comment}
             />
            ))}
          </div>
          <div className="divider"></div>
          <div className="mapBlock"> 
            <GoogleMap 
            markers={[
              {
                lat: firstPoint.latitude, 
                lng: firstPoint.longitude,
                title: content.title,
                location: content.description,
                time: content.audioFile !== null ? content.audioFile?.durationInSeconds : 0
              }
            ]}
            height="400px"
            />        
          </div>
        </div>
      </div>
      <hr className="solid" />
      {user &&(
        <RecommenderContainer />
      )}
    </div>
  );
}

export default Content;