import React, {useState, useRef, useEffect, useContext} from 'react'
import Logo from '../assets/logo.jpg'
import { Link, useNavigate } from 'react-router-dom'
import ReorderIcon from '@mui/icons-material/Reorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AddIcon from '@mui/icons-material/Add';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { UserContext } from '../context/UserContext';
import "../styles/NavBar.css"
import { Slide, ToastContainer } from 'react-toastify';

function NavBar({ isAuthenticated, toggleLoginPage, handleLogout }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { user } = useContext(UserContext);
  const menuRef = useRef(null);
  const navigate = useNavigate()

  const onLogoutClick = () => {
    navigate('/')
    handleLogout()
  }

  const toggleVisibility = () => {
    setIsMenuVisible(!isMenuVisible); 
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              {isAuthenticated ? (
                <button onClick={onLogoutClick}> ВИЙТИ </button>
              ) : (
                <button onClick={toggleLoginPage}> УВІЙТИ </button>
              )}
            </div>
        </div>
        {user && (
        <div className='floatingMenuContainer' ref={menuRef}>
          <button className='floatingMenuReorderButton' onClick={toggleVisibility}>
            <ReorderIcon />
          </button>
            <div className={`floatingMenu ${isMenuVisible ? "visible" : "hidden"}`}>
              <Link to={`profile/${user?.id}`} className='floatingMenuTabButton'>
                <PersonOutlineIcon />
              </Link>
              <Link to={`content?edit=true`} className='floatingMenuTabButton'>
                <AddIcon />
              </Link>
              <Link to={`library`} className='floatingMenuTabButton'>
                <VideoLibraryIcon />
              </Link>
            </div>
        </div>
        )}

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        limit={1}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
        />
    </div>
  )
}

export default NavBar