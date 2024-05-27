import {useRef, useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Profile.css';
import ProfileDummyImage from '../assets/profile-dummy.jpg'
import ContentContainer from '../components/ContentContainer';

const ApiUrl = process.env.REACT_APP_API_URL

function Profile() {
  const { userId } = useParams()

  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState([])
  const [contents, setContents] = useState([])

  //const navigate = useNavigate()
  
  const abortControllerRef = useRef(null)

  /*const handleContentItemClick = (contentId) => {
    navigate(`/content/${contentId}`)
  }

  const handleButtonClick = () => {
     if(searchAreaRef.current)
      searchAreaRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
  }*/

  const formatInfoAboutContent = (contents) => {
    let outputMessage = 'Ще не створено жодного контенту'

    if(contents === null || contents === undefined || contents.length === 0)
      return outputMessage

    outputMessage = `Створено ${contents.length} `

    if(contents.length === 1)
      return outputMessage + 'контент'

    if([2, 3, 4].includes(contents.length))
      return outputMessage + 'контенти'

    return outputMessage + 'контентів'
  }

  useEffect(() => {
    const fetchContent = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      
      try {
        const response = await fetch(`${ApiUrl}/User/${userId}`, {
          signal: abortControllerRef.current.signal
        });
        const userData = await response.json();

        const responseContents = await fetch(`${ApiUrl}/User/${userId}/contents`);
        const contentData = await responseContents.json();

        setUser({ ...userData, contents: contentData });
        setContents(contentData)
        console.log(contentData)
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
  }, [userId]);  

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Something went wrong. Please try again</div>
  }  

  return (
    <div className="profileContainer">
      {/* First row */}
      <div className="profileRow">
        {/* Profile image block (square, empty) */}
        <div className="profileImage">
          <img src={ProfileDummyImage} alt='Profile Image' />
        </div>
        {/* Details block */}
        <div className="detailsBlock">
          <div className="detailsRow">
            <h1>{user.firstname} {user.lastname}</h1>
          </div>
          <div className="detailsRow">
            <p>{user.description}</p>
          </div>
          <div className="detailsRow">
            <p>{user.email}</p>
          </div>
          <div className='detailsRow'>
            <p>{formatInfoAboutContent(contents)}</p>
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="contentsRow">
        <ContentContainer
          contents = {contents}
        />
      </div>
    </div>
  );
}

export default Profile;