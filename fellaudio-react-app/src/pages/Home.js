import { ContentList } from '../helpers/contentList'; // Assuming you have a blockList file with data
import ContentItem from '../components/ContentItem'; // Assuming you have a BlockItem component
import '../styles/Home.css';
//import { getContents } from '../services/ContentApiClient.js'
import { useState, useEffect, useRef } from "react"
import DummyImage from '../assets/dummy.jpg'
import { useNavigate } from 'react-router-dom';

const ApiUrl = process.env.REACT_APP_API_URL

function Home() {
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [contents, setContent] = useState([])
  const [page, setPage] = useState(0)
  
  const navigate = useNavigate()
  
  const abortControllerRef = useRef(null)

  const handleContentItemClick = (contentId) => {
    navigate(`/content/${contentId}`)
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
        const contents = await response.json()
        console.log(contents)
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

  return (
    <div className='home'>
      <div className='searchArea'>
        <input type='text' placeholder='Search...' />
        <button>Search</button>
      </div>
      <div className='blocksContainer'>
        {contents.map((contentItem, key) => (
          <div onClick={() => handleContentItemClick(contentItem.id)}>
            <ContentItem
              key={key}
              image={DummyImage}
              name={contentItem.title}
              location={contentItem.description}
              time={contentItem.audioFile !== null ? contentItem.audioFile.durationInSeconds : 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;