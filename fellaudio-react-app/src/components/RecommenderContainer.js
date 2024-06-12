import React, {useContext, useState, useEffect} from 'react'
import ContentContainer from './ContentContainer'
import { UserContext } from '../context/UserContext'
import { FillContentWithImages } from '../utils/tempUtil';

const ApiUrl = process.env.REACT_APP_API_URL

function RecommenderContainer({currentContent}) {
    const { user } = useContext(UserContext);
    const [contents, setContents] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchContent = async () => {    
          setIsLoading(true);
          if(user === null)
            return
          try {
            const response = await fetch(`${ApiUrl}/User/${user.id}/recommendations`);    
            let contents = await response.json()
            console.log("ot", currentContent.id)
            contents = contents.filter(c => c.id != currentContent.id)
            contents = contents.slice(0, 3)
            FillContentWithImages(contents)
            setContents(contents)
          } 
          catch (err) {
            if (err.name === 'AbortError') {
              console.log("Aborted");
              return;
            }
            console.log(err)
            setError(err);
          } 
          finally {
            setIsLoading(false);
          }
        };
    
        fetchContent();
      }, [user, currentContent]); 

      if (isLoading) {
        return <div>Loading...</div>
      }
    
      if (error) {
        return <div>Something went wrong. Please try again</div>
      }
    

  return (
    <div className='recommenderContainer'>
        <span>Вам може сподобатися:</span>
        <ContentContainer
          contents={contents}
        />
    </div>
  )
}

export default RecommenderContainer
