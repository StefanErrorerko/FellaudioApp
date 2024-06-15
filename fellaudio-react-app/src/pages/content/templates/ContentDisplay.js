import React, {useState, useRef, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../styles/Content.css';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DummyImage from '../../../assets/dummy.jpg'

import Waveform from "../../../components/Waveform";
import GoogleMap from '../../../components/Map'
import RecommenderContainer from '../../../components/RecommenderContainer';
import { UserContext } from '../../../context/UserContext';
import {  FillContentWithMedia } from '../../../utils/tempUtil';
import CommentBlock from '../../../components/Comment/CommentContainer';
import CommentForm from '../../../components/Comment/CommentForm';
import { sortComments, likeContent, dislikeContent, sortPoints } from './../utils/contentUtils';
import CommentFormDisabled from '../../../components/Comment/CommentFormDisabled';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileDummyImage from '../../../assets/profile-dummy.jpg'
import FloatingEditButton from '../../../components/FloatingEditButton';

const ApiUrl = process.env.REACT_APP_API_URL

function ContentDisplay() {
  const { contentId } = useParams()
  const {user} = useContext(UserContext)

  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState([])
  const [comments, setComments] = useState([])
  const [page, setPage] = useState(0)
  const [firstPoint, setFirstPoint] = useState({
    location: {
      latitude: 50.15,
      longitude: 30.47,
      name: "default"
    }
    
  })
  const [isLiked, setIsLiked] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [audiofile, setAudiofile] = useState(null);
  const navigate = useNavigate()

  const commentsContainerRef = useRef(null);

  const handleUserClick = (userId) => {
    if(userId !== undefined)
      navigate(`/profile/${userId}`)
  }

  const handleLikeClick = async (user) => {
    try {        
      if(isLiked)
        await dislikeContent(user, content)
      if(!isLiked)
        await likeContent(user, content)
    } catch (err) {
      setError(err)
    }
    setIsLiked(!isLiked)
  }

  const handleEditClick = () => {
    navigate(`/content/${content.id}?edit=true`)
    window.location.reload();   
  }

  const handleDownloadClick = () => {
    if (content.audioFile && content.audioFile.data) {
      const link = document.createElement('a');
      link.href = content.audioFile.data;
      link.download = `${content.title}_audio.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloaded(true);
    }
  };

  const handleCommentSubmit = async (text) => {
    try {
      let body = {
        text: text,
        userId: user.id,
        contentId: content.id
      }

      const response = await fetch(`${ApiUrl}/Comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Failed to POST comment')
      }

      setComments()
    } catch (err) {
      setError(err)
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast('Посилання скопійовано!'))
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
        const contentsWithMedia = await FillContentWithMedia([contentData]);
        setContent(contentsWithMedia[0]);
        const sortedPoints = sortPoints(pointsData)
        
        if (sortedPoints.length > 0) {
          setFirstPoint(sortedPoints[0]);
        }

        // if user logged in
        if(user) {
          const playlistResponse = await fetch(`${ApiUrl}/User/${user.id}/playlist/saved`, {
            signal: abortControllerRef.current.signal
          })
          const playlistData = await playlistResponse.json()
        
          const contentResponse = await fetch(`${ApiUrl}/Playlist/${playlistData.id}/content`, {
            signal: abortControllerRef.current.signal
          })
          const contentsData = await contentResponse.json()

          setIsLiked(contentsData.some(c => c.id == contentData.id))
        }
        
        if(commentsContainerRef.current)
            commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
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
    return <div>Завантаження...</div>
  }

  if (error) {
    console.log(error)
    return <div>Щось пішло не так</div>
  }
  
  return (
    <div className="content">
      <div className="imageContainer">
        <img 
          src={content.image ? content.image : DummyImage} 
          alt={content.name} 
          className="contentImage" 
        />
      </div>
      <div className='contentTitleBackground'></div>
      <div className='contentTitle'>
        <h1>{content.title}</h1>
      </div>
      <div className='contentContainer'>
        <div className='contentAudio'>
        {content.audioFile && <Waveform audioFile={content.audioFile.data} />}
        </div>
        <div className='contentUnderAudioRow'>
          <div className='contentAuthor'>
            <img className='profileImageSmall' 
              src={content.user && content.user.image ? content.user.image : ProfileDummyImage} 
              alt='User Profile Image' 
              onClick={() => handleUserClick(content.user?.id)}
            />
            <div className="contentAuthorDetails">
                <span onClick={() => handleUserClick(content.user?.id)}>
                  {content.user ? content.user.firstname : 'Deleted User'} {content.user?.lastname}
                </span>
                <span>Автор</span>
            </div>
          </div>
          <div className='contentActions'>
            {content.audioFile?.data &&( 
              <button className={isDownloaded ? 'clickedButton' : 'unclickedButton'} onClick={() => handleDownloadClick()}>
                {isDownloaded ? (
                  <div><ArrowDownwardIcon /><p>Завантажено</p></div>
                ) : (
                  <div><ArrowDownwardIcon /><p>Завантажити</p></div>
                )}
              </button>
            )}
            {user &&(
              <button className={isLiked ? 'clickedButton' : 'unclickedButton'} onClick={() => handleLikeClick(user)}>
                {isLiked ? (
                  <div><FavoriteIcon /><p>Збережено</p></div>
                ) : (
                  <div><FavoriteBorderIcon /><p>Зберегти</p></div>
                )}
              </button>
            )}
            <button className='unclickedButton' onClick={handleShareClick}>
              <ShareIcon /><p>Поділитись</p>
            </button>
          </div>
        </div>
        <div className='contentDescription'>
          <h2>Опис екскурсії:</h2>
          <p>{content.description}</p>
        </div>
        <div className="detailsRow">
          <div className="commentsContainer" ref={commentsContainerRef}>
          {sortComments(content.comments)?.map((comment, key) => (
             <CommentBlock 
              key={key}
              comment={comment}
             />
            ))}
          {user ? (
            <CommentForm 
              onSubmit={handleCommentSubmit}
            />
          ) : (
            <CommentFormDisabled />
          )}
          </div>
          <div className="divider"></div>
          <div className="mapBlock"> 
            {content.length !== 0 && (
              <GoogleMap 
                contents={[content]}
                height="400px"
                center={content.points[0].location}
                />  
            )}
                  
          </div>
        </div>
      </div>
      <hr className="solid" />
      {user &&(
        <RecommenderContainer
          currentContent = {content}
        />
      )}

      {content.user?.id == user?.id && (
        <FloatingEditButton 
          handleOnClick={handleEditClick}
          isEditing={false}
        />
      )}      
    </div>
  );
}

export default ContentDisplay;