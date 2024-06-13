import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

import NavBar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Content from './pages/content/Content';
import Profile from './pages/Profile';
import Library from './pages/Library';
import ScrollToTop from './utils/ScrollToTop';
import Playlist from './pages/playlist/Playlist';

const ApiUrl = process.env.REACT_APP_API_URL

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState()
  const [user, setUser] = useState(null);
  const [playlistSaved, setPlaylistSaved] = useState(null)
  const [isLoginPageVisible, setIsLoginPageVisible] = useState(false);
  const abortControllerRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      setUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    if (isLoginPageVisible) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isLoginPageVisible]);

  const handleLogin = async (email, password) => {
    const hashedPassword = 
    //CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    password

    const fetchContents = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const formData = {
        email: email,
        hashedPassword: hashedPassword
      };

      console.log("form", formData);

      try {
        const responseUser = await fetch(`${ApiUrl}/User/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
          signal: abortControllerRef.current.signal
        });

        if (!responseUser.ok) {
          throw new Error(`Error: ${responseUser.status} ${responseUser.statusText}`);
        }
        const user = await responseUser.json();
        console.log("response", responseUser);
        setUser(user);
        console.log("user", user)
        const responsePlaylist = await fetch(`${ApiUrl}/User/${user?.id}/playlist/saved`, {
          signal: abortControllerRef.current.signal
        })

        if (!responsePlaylist.ok) {
          throw new Error(`Error: ${responsePlaylist.status} ${responsePlaylist.statusText}`);
        }

        const playlist = await responsePlaylist.json()
        setPlaylistSaved(playlist)

        setIsAuthenticated(true);
        setIsLoginPageVisible(false);
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('playlistSaved', JSON.stringify(playlist));
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log("Aborted");
          return;
        }
        console.error("Fetch error: ", err);
        setError(err.message);
      }
      finally{
        window.location.reload()
      }
    };

    fetchContents()

    if (email === 'test@mail.com' && password === 'password') {
      const userData = { email, userId: 1 };
      localStorage.setItem('token', 'mockToken');
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      setIsLoginPageVisible(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('playlistSaved');
    setIsAuthenticated(false);
    setUser(null);
    setPlaylistSaved(null)
    window.location.reload()
  };

  const toggleLoginPage = () => {
    setIsLoginPageVisible(!isLoginPageVisible);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('login-page')) {
      setIsLoginPageVisible(false);
    }
  };

  return (
    <div className='App'>
      <Router>
        <ScrollToTop />
        <NavBar
          isAuthenticated={isAuthenticated}
          toggleLoginPage={toggleLoginPage}
          handleLogout={handleLogout}
        />
        <div className={`content ${isLoginPageVisible ? 'blur' : ''}`}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/login' element={<Login onLogin={handleLogin} />} />
            <Route path="/content/:contentId" element={<Content />} />
            <Route path="/content" element={<Content />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/library" element={<Library />} />
            <Route path="/playlist/:playlistId" element={<Playlist />} />
          </Routes>
        </div>
      </Router>
      {isLoginPageVisible && (
        <div className="login-page" onClick={handleOverlayClick}>
            <Login onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
}

export default App;
