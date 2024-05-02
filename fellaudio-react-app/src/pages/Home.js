import React from 'react'
import '../styles/Home.css'
import Lukianivka from '../assets/lukianivka.jpg'

function Home() {
  return (
    <div className='home'>
      <div className='searchArea'>
        {/* Search input */}
        <input type='text' placeholder='Search...' />
        {/* Search button */}
        <button>Search</button>
      </div>

      <div className='blocksContainer'>
        <div className='block'>
          <div className='blockImage'>
            <img src={Lukianivka} alt='Block Image' />
          </div>
          <div className='blockContent'>
            <h1>Name</h1>
            <h2>Location</h2>
            <h3>Time</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home