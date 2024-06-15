import '../styles/Home.css';
import { useState, useEffect, useRef } from "react";
import DummyImage from '../assets/dummy.jpg';
import HomeFiller1 from '../assets/home_filler4.png';
import ContentContainer from '../components/ContentContainer';
import SwitchContentMap from '../components/SwitchContentMap';
import GoogleMap from '../components/Map';
import { FillContentWithImages, FillContentWithMedia } from '../utils/tempUtil';
import { useNavigate } from 'react-router-dom';

const ApiUrl = process.env.REACT_APP_API_URL;

function Home() {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchAreaRef = useRef(null);
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  const handleButtonClick = () => {
    if (searchAreaRef.current)
      searchAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSwitchChange = (checked) => {
    setIsSwitchOn(checked);
  };

  const handleContentItemClick = (contentId) => {
    navigate(`/content/${contentId}`);
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterContents(query);
  };

  const filterContents = (query) => {
    if (query.trim() === '') {
      setFilteredContents(contents);
    } else {
      const filtered = contents.filter(content =>
        content.title.toLowerCase().includes(query.toLowerCase()) ||
        content.area.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredContents(filtered);
    }
  };

  useEffect(() => {
    const fetchContents = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);

      try {
        const response = await fetch(`${ApiUrl}/Content`, {
          signal: abortControllerRef.current.signal
        });
        let contentsData = await response.json();
        contentsData = await FillContentWithMedia(contentsData);
        setContents(contentsData);
        setFilteredContents(contentsData);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log("Aborted");
          return;
        }

        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return <div>Щось пішло не так</div>;
  }

  return (
    <div className='home'>
      <div className="topContainer">
        <img src={HomeFiller1} alt="Home Filler" />
        <div className="textOverlay">
          Місце, де ти знайдеш історію для себе
        </div>
        <button className="buttonOverlay" onClick={handleButtonClick}>РОЗПОЧАТИ</button>
      </div>
      <div className='searchArea' ref={searchAreaRef}>
        <input 
          type='text' 
          placeholder='Уведіть назву екскурсії або місцевість...' 
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button onClick={() => filterContents(searchQuery)}>ПОШУК</button>
        <SwitchContentMap 
          isSwitchOn={isSwitchOn}
          handleSwitchChange={handleSwitchChange}
        />
      </div>
      {isSwitchOn ? (
        <ContentContainer
          contents={filteredContents}
        />
      ) : (
        <div className="mapContainer">
          <GoogleMap 
            contents={filteredContents}
            height="800px"
            isClickableWindows={true}
            onItemClick={handleContentItemClick}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
