import React from 'react';
import { ContentList } from '../helpers/contentList'; // Assuming you have a blockList file with data
import ContentItem from '../components/ContentItem'; // Assuming you have a BlockItem component
import '../styles/Home.css';

function Home() {
  return (
    <div className='home'>
      <div className='searchArea'>
        <input type='text' placeholder='Search...' />
        <button>Search</button>
      </div>

      <div className='blocksContainer'>
        {ContentList.map((contentItem, key) => (
          <ContentItem
            key={key}
            image={contentItem.image}
            name={contentItem.name}
            location={contentItem.location}
            time={contentItem.time}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;