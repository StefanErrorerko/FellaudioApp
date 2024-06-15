import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

import NavBar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Content from './pages/content/Content';
import Profile from './pages/profile/Profile';
import Library from './pages/Library';
import ScrollToTop from './utils/ScrollToTop';
import Playlist from './pages/playlist/Playlist';
import { removeContext, updateContext } from './context/UserContext';
import Panel from './pages/panel/Panel';

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

        const responsePlaylist = await fetch(`${ApiUrl}/User/${user.id}/playlist/saved`, {
          signal: abortControllerRef.current.signal
        });
        let playlistSaved
        if (responsePlaylist.ok) {
            playlistSaved = responsePlaylist.json()
        }
          console.log("kkk", playlistSaved)

          if(!playlistSaved){
              const playlistCreateResponse = await fetch(`${ApiUrl}/Playlist`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      description: 'Ваш плейлист вподобаного',
                      type: 'Saved',
                      userId: user.id
                  }),
                  signal: abortControllerRef.current.signal
              });
              playlistSaved = await playlistCreateResponse.json();
              console.log("mmm", playlistSaved)

          }

        if (!responsePlaylist.ok) {
          throw new Error(`Error: ${responsePlaylist.status} ${responsePlaylist.statusText}`);
        }

        const playlist = playlistSaved
        setPlaylistSaved(playlist)

        setIsAuthenticated(true);
        setIsLoginPageVisible(false);
        updateContext(user, playlist)
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

  const handleRegister = async user => {
    const fetchContents = async () => {
      console.log("e", user)
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
    try{
        const responsePlaylist = await fetch(`${ApiUrl}/User/${user.id}/playlist/saved`, {
          signal: abortControllerRef.current.signal
        });
        let playlistSaved
        if (responsePlaylist.ok)
            playlistSaved = responsePlaylist.json()

          if(!playlistSaved){
              const playlistCreateResponse = await fetch(`${ApiUrl}/Playlist`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      description: 'Ваш плейлист вподобаного',
                      type: 'Saved',
                      userId: user.id
                  }),
                  signal: abortControllerRef.current.signal
              });
              playlistSaved = await playlistCreateResponse.json();
              console.log("mmm", playlistSaved)

          }
        
        console.log("e tut?")
        const playlist = playlistSaved
        setPlaylistSaved(playlist)
        console.log("a tut?")

        setIsAuthenticated(true);
        setIsLoginPageVisible(false);
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('playlistSaved', JSON.stringify(playlist));
        console.log("aaaatut?")

      } catch (err) {
        if (err.name === 'AbortError') {
          console.log("Aborted");
          return;
        }
        console.error("Fetch error: ", err);
        setError(err.message);
      }
    };

    fetchContents()
    return false;
  }

  const handleExitLoginPopup = () => {
    setIsLoginPageVisible(false)
  }

  const handleLogout = () => {
    removeContext()
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
            <Route path="/profile" element={<Profile onRegister={handleRegister}/>} />
            <Route path="/library" element={<Library />} />
            <Route path="/playlist/:playlistId" element={<Playlist />} />
            <Route path='/admin/panel' element={<Panel />} />
          </Routes>
        </div>
        {isLoginPageVisible && (
        <div className="login-page" onClick={handleOverlayClick}>
            <Login 
              onLogin={handleLogin}
              onExitLoginPopup={handleExitLoginPopup}
            />
        </div>
      )}
      </Router>
    </div>
  );
}

export default App;
