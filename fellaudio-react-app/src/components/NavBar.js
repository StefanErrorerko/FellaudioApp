import React from 'react'
import Logo from '../assets/logo.jpg'
import { Link } from 'react-router-dom'
//import ReorderIcon from '@mui/icons-material/Reorder';
import "../styles/NavBar.css"

function NavBar() {
  return (
    <div className='navbar'>
        <div className='leftSide'>
            <Link to="/">
              <img src={Logo} alt='logo'/>
            </Link> 
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