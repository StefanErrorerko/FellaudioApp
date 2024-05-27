import React, {useState} from 'react'
import Logo from '../assets/logo.jpg'
import { Link } from 'react-router-dom'
import ReorderIcon from '@mui/icons-material/Reorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PlaceIcon from '@mui/icons-material/Place';
import AddIcon from '@mui/icons-material/Add';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import "../styles/NavBar.css"

function NavBar() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible); 
  };

  return (
    <div className='navbar'>
        <div className='leftSide'>
            <Link to="/">
              <img src={Logo} alt='logo'/>
            </Link> 
        </div>
        <div className='rightSide'>
            <div className='hiddenLinks'>
              <Link to="/about"> ПРО НАС </Link>
              <Link to="/login"> УВІЙТИ </Link>
            </div>
        </div>
        <div className='floatingMenuContainer'>
          <button className='floatingMenuReorderButton' onClick={toggleVisibility}>
            <ReorderIcon />
          </button>
            <div className={`floatingMenu ${isVisible ? "visible" : "hidden"}`}>
              <button className='floatingMenuTabButton'>
                <PersonOutlineIcon />
              </button>
              <button className='floatingMenuTabButton'>
                <PlaceIcon />
              </button>
              <button className='floatingMenuTabButton'>
                <AddIcon />
              </button>
              <button className='floatingMenuTabButton'>
                <VideoLibraryIcon />
              </button>
            </div>
        </div>
    </div>
  )
}


export default NavBar