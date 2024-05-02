import './App.css';
import NavBar from './components/Navbar';
//import Footer from './components/Footer'
import Home from './pages/Home'
//import Menu from './pages/Menu'
import About from './pages/About'
import Login from './pages/Login'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element = {<Home />} />
          <Route path='/about' element = {<About />} />
          <Route path='/login' element = {<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
