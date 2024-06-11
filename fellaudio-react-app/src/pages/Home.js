import '../styles/Home.css';
//import { getContents } from '../services/ContentApiClient.js'
import { useState, useEffect, useRef } from "react"
import DummyImage from '../assets/dummy.jpg'
import HomeFiller1 from '../assets/home_filler4.png'
import ContentContainer from '../components/ContentContainer';
import MapSwitch from '../components/Switch'
import GoogleMap from '../components/Map';
import { FillContentWithImages, FillContentWithMedia } from '../utils/tempUtil';

const ApiUrl = process.env.REACT_APP_API_URL

function Home() {
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [contents, setContents] = useState([])
  const [page, setPage] = useState(0)
  const searchAreaRef = useRef(null);
  const [isSwitchOn, setIsSwitchOn] = useState(true);
    
  const abortControllerRef = useRef(null)

  const handleButtonClick = () => {
     if(searchAreaRef.current)
      searchAreaRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
  }

  const handleSwitchChange = (checked) => {
    setIsSwitchOn(checked);
  }

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
        console.log(contentsData)
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
        <MapSwitch 
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
          markers={[
            {lat: 50.4610985, lng: 30.4816667, title:"Блакитна прогулянка", location: 'Лук\'янівська', time: 889  },
            {lat: 50.456442, lng: 30.4931728, title:"Фотографії на Січових", location: 'Лук\'янівська', time: 2788},
            {lat: 50.3991807, lng: 30.5367587, title:"Цеглина Лисогірського форту", location: 'Деміївка', time: 3785},
            {lat: 50.4642107, lng: 30.5073132, title:"Таємниці Щекавиці", location: 'Лук\'янівська', time: 3750},
            {lat: 50.440184, lng: 30.54942, title:"Салют", location: 'Арсенальна', time: 2864},
          ]}
          height="800px"
          />
        </div>
      )}
      
    </div>
  );
}

export default Home;