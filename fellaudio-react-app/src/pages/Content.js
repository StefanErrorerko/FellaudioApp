import React, {useState, useRef, useEffect} from 'react';
import '../styles/Content.css';
import { ContentList } from '../helpers/contentList';
import Waveform from "../components/Waveform";
import { useParams } from 'react-router-dom';
import DummyImage from '../assets/dummy.jpg'

const ApiUrl = process.env.REACT_APP_API_URL

function Content() {
  const { contentId } = useParams()

  //var content = ContentList[0]; // Assuming you are displaying the first item for now

  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState([])
  const [page, setPage] = useState(0)
  
  const abortControllerRef = useRef(null)

  useEffect(() => {
    const fetchContent = async () => {
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      setIsLoading(true)
      
      try {
        const response = await fetch(`${ApiUrl}/Content/${contentId}`, {
          signal: abortControllerRef.current.signal
        })
        const content = await response.json()
        console.log(content)
        setContent(content)
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

    fetchContent()
  }, [])  

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
      <h1>{content.title}</h1>
      <div>
        <Waveform url="https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3" />
      </div>
      <p>{content.description}</p>
      <div className="detailsRow">
        <div className="commentsBlock">
          {/* Your comments component */}
        </div>
        <div className="divider"></div>
        <div className="mapBlock">
          {/* Your map component */}
        </div>
      </div>
    </div>
  );
}

export default Content;