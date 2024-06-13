import '../styles/Home.css';
//import { getContents } from '../services/ContentApiClient.js'
import { useState, useEffect, useRef } from "react"
import DummyImage from '../assets/dummy.jpg'
import HomeFiller1 from '../assets/home_filler4.png'
import ContentContainer from '../components/ContentContainer';
import SwitchContentMap from '../components/SwitchContentMap'
import GoogleMap from '../components/Map';
import { FillContentWithImages, FillContentWithMedia } from '../utils/tempUtil';
import { useNavigate } from 'react-router-dom';

const ApiUrl = process.env.REACT_APP_API_URL

function Home() {
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [contents, setContents] = useState([])
  const [page, setPage] = useState(0)
  const searchAreaRef = useRef(null);
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const navigate = useNavigate()
    
  const abortControllerRef = useRef(null)

  const handleButtonClick = () => {
     if(searchAreaRef.current)
      searchAreaRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
  }

  const handleSwitchChange = (checked) => {
    setIsSwitchOn(checked);
  }

  const handleContentItemClick = (contentId) => {
    console.log("popab")
    navigate(`/content/${contentId}`);
  };

  useEffect(() => {
    const fetchContents = async () => {
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      setIsLoading(true)
      
      try {
        const response = await fetch(`${ApiUrl}/Content`, {
          signal: abortControllerRef.current.signal
        })
        const contentsData = await response.json()
        await FillContentWithMedia(contentsData)
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
  }, [])  

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Something went wrong. Please try again</div>
  }

  return (
    <div className='home'>
      <div className="topContainer">
        <img src={HomeFiller1} />
        <div className="textOverlay">
          Місце, де ти знайдеш історію для себе
        </div>
        <button className="buttonOverlay" onClick={handleButtonClick}>РОЗПОЧАТИ</button>
      </div>
      <div className='searchArea' ref={searchAreaRef}>
        <input type='text' placeholder='Уведіть запит...' />
        <button>ПОШУК</button>
        <SwitchContentMap 
          isSwitchOn={isSwitchOn}
          handleSwitchChange={handleSwitchChange}
        />
      </div>
      {isSwitchOn ? (
        <ContentContainer
        contents ={contents}
      />
      ) : (
        <div className="mapContainer">
          <GoogleMap 
            contents={contents}
            height="800px"
            isClickableWindows={true}
            onItemClick={handleContentItemClick}
          />
        </div>
      )}
      
    </div>
  );
}

export default Home;