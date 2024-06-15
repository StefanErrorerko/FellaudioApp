import React, { useEffect, useRef, useState } from 'react';
import ContentContainer from '../../../components/ContentContainer';
import { FillContentWithMedia } from '../../../utils/tempUtil';

const ApiUrl = process.env.REACT_APP_API_URL;

function ContentTable() {
  const abortControllerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContents = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${ApiUrl}/Content`, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentsData = await response.json();
        const contentsWithMedia = await FillContentWithMedia(contentsData);
        setContents(contentsWithMedia);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Error fetching content:', err);
          setError(err.message || 'Error fetching content');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Function to handle blocking content
  const handleBlockContent = async contentId => {
    try {
        const content = contents.find(c => c.id === contentId)

        let status = "Banned"
        if(content.status === "Banned")
            status = "Published"

        const body = {
            "title": content.title,
            "description": content.description,
            "area": content.area,
            "status": status
          }

          console.log(body)
    
          const response = await fetch(`${ApiUrl}/Content/${contentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify(body),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          let contentData = await response.json();
          contentData = (await FillContentWithMedia([contentData]))[0]
          const index = contents.findIndex(c => c.id === contentId);

            if (index !== -1) {
            // Create a new array with the updated item
            const updatedContents = [
                ...contents.slice(0, index), // items before the updated item
                { ...contents[index], status: contentData.status }, // updated item
                ...contents.slice(index + 1) // items after the updated item
            ];

            // Update the state with the new array
            setContents(updatedContents);
            }
          

    } catch (err) {
      if(err.name === 'AbortError'){
        console.log("Aborted")
        return
      }
      setError(err)
    }
  }

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    console.log(error)
    return <div>Щось пішло не так</div>;
  }

  return (
    <div>
        {contents.length > 0 ? (
        <ContentContainer
            isEdited={true}
            contents={contents}
            onEditAction={handleBlockContent}
            showHidden={true}
        />
        ) : (
            <div>Завантаження...</div>
        )}
    </div>
  );
}

export default ContentTable;
