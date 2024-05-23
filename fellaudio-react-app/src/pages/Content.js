import React, {useState, useRef, useEffect} from 'react';
import '../styles/Content.css';
import { ContentList } from '../helpers/contentList';
import Waveform from "../components/Waveform";
import { useNavigate, useParams } from 'react-router-dom';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import ProfileDummyImage from '../assets/profile-dummy.jpg'
import GoogleMap from '../components/Map'
import DummyImage from '../assets/dummy.jpg'

const ApiUrl = process.env.REACT_APP_API_URL


function Content() {
  const { contentId } = useParams()

  //var content = ContentList[0]; // Assuming you are displaying the first item for now

  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState([])
  const [page, setPage] = useState(0)
  const [firstPoint, setFirstPoint] = useState({
    latitude: 50.15,
    longitude: 30.47
  })

  
  const navigate = useNavigate()


  const handleCommentClick = (userId) => {
    if(userId !== undefined)
      navigate(`/profile/${userId}`)
  }
  
  const abortControllerRef = useRef(null)
  
  function formatDate(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
  
    const secondsInMinute = 60;
    const secondsInHour = secondsInMinute * 60;
    const secondsInDay = secondsInHour * 24;
    const secondsInMonth = secondsInDay * 30;
    const secondsInYear = secondsInDay * 365;
  
    if (diffInSeconds >= secondsInYear) {
      const years = Math.floor(diffInSeconds / secondsInYear);
      return `${years}y. ago`;
    } else if (diffInSeconds >= secondsInMonth) {
      const months = Math.floor(diffInSeconds / secondsInMonth);
      return `${months}m. ago`;
    } else if (diffInSeconds >= secondsInDay) {
      const days = Math.floor(diffInSeconds / secondsInDay);
      if (days === 1) {
        return 'yesterday';
      }
      return `${days}d. ago`;
    } else if (diffInSeconds >= secondsInHour) {
      const hours = Math.floor(diffInSeconds / secondsInHour);
      return `${hours}h. ago`;
    } else if (diffInSeconds >= secondsInMinute) {
      const minutes = Math.floor(diffInSeconds / secondsInMinute);
      return `${minutes}min ago`;
    } else {
      return `${diffInSeconds}sec ago`;
    }
  }

  function sortPoints(points) {
    const pointMap = new Map(points.map(point => [point.id, point]));
    
    const sortedPoints = [];
    let currentPoint = points.find(point => point.previousPointId === 0);
    
    while (currentPoint) {
      sortedPoints.push(currentPoint);
      currentPoint = pointMap.get(currentPoint.id);
    }
    
    return sortedPoints;
  }

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
        <img src={DummyImage} alt={content.name} className="contentImage" />
      </div>
      <div className='contentTitle'>
        <div></div>
        <h1>{content.title}</h1>
      </div>
      <div className='contentContainer'>
        <div className='contentAudio'>
          <Waveform url="https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3" />
        </div>
        <div className='contentActions'>
          <button><ArrowDownwardIcon /><p>Завантажити</p></button>
          <button><AddIcon /><p>Зберегти</p></button>
          <button><ShareIcon /><p>Поділитись</p></button>
        </div>
        <div className='contentDescription'>
          <p>{content.description}</p>
        </div>
        <div className="detailsRow">
          <div className="commentsContainer">
          {content.comments?.map((comment, key) => (
            <div className="commentBlock">
              <div className="commentLeftSide" >
                  <img className='profileImageSmall' src={ProfileDummyImage} alt='User Profile Image' onClick={() => handleCommentClick(comment.user?.id)}/>
              </div>
              <div className="commentRightSide">
                <div className="commentHeader" onClick={() => handleCommentClick(comment.user?.id)}>
                  <span>{comment.user ? comment.user.firstname : 'Deleted User'} {comment.user?.lastname}</span>
                  <span className="commentDate">{
                    comment.user?.createdAt ? formatDate(comment.user?.createdAt) : ''
                  }</span>
                </div>
                <div className="commentBody">
                  {comment.text}
                </div>
              </div>
            </div>  
            ))}
          </div>
          <div className="divider"></div>
          <div className="mapBlock"> 
            <GoogleMap 
            lat = {firstPoint.latitude}
            lng={firstPoint.longitude}
            />        
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Content;