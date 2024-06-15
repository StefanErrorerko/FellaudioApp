import {useRef, useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../styles/Profile.css';
import ProfileDummyImage from '../../../assets/profile-dummy.jpg'
import ContentContainer from '../../../components/ContentContainer';
import { FillContentWithMedia, FillProfileWithImages } from '../../../utils/tempUtil';
import FloatingEditButton from '../../../components/FloatingEditButton';
import { UserContext } from '../../../context/UserContext';
import { formatInfoAboutContent } from '../utils/profileUtils';

const ApiUrl = process.env.REACT_APP_API_URL

function ProfileDisplay() {
  const { userId } = useParams()
  const {user} = useContext(UserContext)

  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [userDisplay, setUserDisplay] = useState([])
  const [contents, setContents] = useState([])

  const navigate = useNavigate()
  
  const abortControllerRef = useRef(null)

  const handleEditClick = () => {
    navigate(`/profile/${userId}?edit=true`)
    window.location.reload();        
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
        FillProfileWithImages([userData])

        const responseContents = await fetch(`${ApiUrl}/User/${userId}/contents`);
        let contentData = await responseContents.json();

        setUserDisplay({ ...userData, contents: contentData });
        contentData = await FillContentWithMedia(contentData)
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
  }, [userId, user]);  

  if (isLoading) {
    return <div>Завантаження...</div>
  }

  if (error) {
    console.log(error)
    return <div>Щось пішло не так</div>
  }  

  return (
    <div className="profileContainer">
      {/* First row */}
      <div className="profileRow">
        {/* Profile image block (square, empty) */}
        <div className="profileImage">
          <img src={userDisplay.image ? userDisplay.image : ProfileDummyImage} alt='Profile Image' />
        </div>
        {/* Details block */}
        <div className="detailsBlock">
          <div className="fullnameRow">
            <h1>{userDisplay.firstname} {userDisplay.lastname}</h1>
          </div>
          <div className="descriptionRow">
            <p>{userDisplay.description}</p>
          </div>
          <div className="emailRow">
            <p>Пошта:</p>
            <span>{userDisplay.email}</span>
          </div>
          <div className='contentDetailsRow'>
            <p>{formatInfoAboutContent(contents)}</p>
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="contentsRow">
        <ContentContainer
          contents = {contents}
          showHidden={true}
        />
      </div>

      {user?.id == userId && (
        <FloatingEditButton 
          handleOnClick={handleEditClick}
          isEditing={false}
        />
      )}
    </div>
  );
}

export default ProfileDisplay;