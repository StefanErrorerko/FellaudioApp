import React from "react";
import ContentItem from "./ContentItem";
import { useNavigate } from "react-router-dom";
import DummyImage from '../assets/dummy.jpg'

const ContentContainer = ({contents, isEdited=false,  playlist=null, onEditAction=null}) =>{
    const navigate = useNavigate()

    const handleContentItemClick = (contentId) => {
        navigate(`/content/${contentId}`)
      }

    return(
        <div className='blocksContainer'>
        {contents.map((contentItem, key) => (
          <div onClick={ () => handleContentItemClick(contentItem.id)}>
            <ContentItem
              key={key}
              contentId = {contentItem.id}
              image={contentItem.image ? contentItem.image : DummyImage}
              name={contentItem.title}
              location={contentItem.description}
              time={contentItem.audioFile !== null ? contentItem.audioFile.durationInSeconds : 0}
              isEdited = {isEdited}
              onEditAction = {onEditAction}
            />
          </div>
        ))}
      </div>
    )
}

export default ContentContainer