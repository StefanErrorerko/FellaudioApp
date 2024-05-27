import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import React, { useState, useEffect, useRef } from 'react';
import CryptoJS from 'crypto-js'

import NavBar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Map from './pages/Map';
import Content from './pages/Content';
import Profile from './pages/Profile';
import Playlist from './pages/Playlist';
import ScrollToTop from './components/ScrollToTop';

const ApiUrl = process.env.REACT_APP_API_URL

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState()
  const [user, setUser] = useState(null);
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
        const response = await fetch(`${ApiUrl}/User/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        console.log("response", response);

        const user = await response.json();
        console.log("response", response);
        setUser(user);
        setIsAuthenticated(true);
        setIsLoginPageVisible(false);
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('user', JSON.stringify(user));
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
    setIsAuthenticated(false);
    setUser(null);
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
            <Route path="/map" element={<Map />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/playlist" element={<Playlist />} />
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
