import './App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home.js'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar/>
        <Routes>
          <Route path='/' element = {<Home />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
