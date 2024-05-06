import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom'

import NavBar from './components/NavBar'
//import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Map from './pages/Map'
import Content from './pages/Content'
import Profile from './pages/Profile'
import Playlist from './pages/Playlist'

function App() {
  return (
    <div className="App">
      <NavBar />
      <Router>
        <Routes>
          <Route path='/' element = {<Home />} />
          <Route path='/about' element = {<About />} />
          <Route path='/login' element = {<Login />} />
          <Route path="/content" element={<Content />} />
          <Route path="/map" element={<Map />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/playlist" element={<Playlist />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
