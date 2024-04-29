import React, {useState} from 'react'
import Logo from '../assets/logo.jpg'
import { Link } from 'react-router-dom'
import ReorderIcon from '@mui/icons-material/Reorder';
import "../styles/Navbar.css"

function NavBar() {
  const [openLinks, setOpenLinks] = useState(false)

  const toggleNavbar = () => {
    setOpenLinks(!openLinks)

  }

  return (
    <div className='navbar'>
        <div className='leftSide' id={openLinks ? "open" : "close"}>
            <img src={Logo} />
            <div className='hiddenLinks'>
              <Link to="/about"> About </Link>
              <Link to="/login"> Login </Link>
            </div>
        </div>
        <div className='rightSide'>
            <Link to="/about"> About </Link>
            <Link to="/login"> Login </Link>
            <button onClick={toggleNavbar}>
              <ReorderIcon />
            </button>
        </div>
    </div>
  )
}

export default NavBar
