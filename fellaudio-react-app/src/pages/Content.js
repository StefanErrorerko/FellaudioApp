import React from 'react';
import '../styles/Content.css';
import { ContentList } from '../helpers/contentList';
import Waveform from "../components/Waveform";

function Content(content) {
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [contents, setContent] = useState([])
  const [page, setPage] = useState(0)
  
  const abortControllerRef = useRef(null)

  useEffect(() => {
    const fetchContents = async () => {
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      setIsLoading(true)
      
      try {
        const response = await fetch(`${ApiUrl}/Content`, {
          signal: abortControllerRef.current.signal
        })
        const contents = await response.json()
        setContent(contents)
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

  var content = ContentList[0]; // Assuming you are displaying the first item for now

  return (
    <div className="content">
      <div className="imageContainer">
        <img src={content.image} alt={content.name} className="contentImage" />
      </div>
      <h1>{content.name}</h1>
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