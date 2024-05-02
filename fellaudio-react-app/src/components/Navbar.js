import React from 'react'
import Logo from '../assets/logo.jpg'
import { Link } from 'react-router-dom'
import ReorderIcon from '@mui/icons-material/Reorder';
import "../styles/Navbar.css"

function NavBar() {
  return (
    <div className='navbar'>
        <div className='leftSide'>
            <img src={Logo} />
        </div>
        <div className='rightSide'>
            <div className='hiddenLinks'>
              <Link to="/about"> About </Link>
              <Link to="/login"> Login </Link>
            </div>
        </div>
    </div>
  )
}


export default NavBar
