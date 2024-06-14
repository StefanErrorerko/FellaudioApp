import React, { useState, useRef, useEffect, useContext } from 'react';
import '../../../styles/ContentEdit.css';
import DummyImage from '../../../assets/dummy.jpg';
import SwitchPointLocation from '../../../components/SwitchPointLocation';
import { getAreas } from '../../../assets/Area';
import { UserContext } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const ApiUrl = process.env.REACT_APP_API_URL;

function ContentEdit() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false); // State for toggle switch
  const [selectedArea, setSelectedArea] = useState(''); // State for selected option
  const [selectedLocation, setSelectedLocation] = useState(''); // State for selected option
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const {user} = useContext(UserContext)

  const abortControllerRef = useRef(null);

  const areas = getAreas();

  const isPointInput = (latitude, longitude) =>{
    if(showCoordinates && (latitude.trim() === '' || longitude.trim() === '' || latitude.trim() === ' ' || longitude.trim() === ' '))
        return false

    if(!showCoordinates && (selectedLocation === '' || selectedLocation === ' ' || selectedLocation === '(жодна)' || !selectedLocation))
        return false

    return true
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError('Фото має бути меншим за 5 МБайт');
      return;
    }
    setImageFile(file);
  };


  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(locations.find(l => l.name === e.target.value));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 100 * 1024 * 1024) {
      setError('Аудіофайл має бути менший за 100 МБайт.');
      return;
    }
    setAudioFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const latitude = document.querySelector('input[placeholder="Широта"]').value;
    const longitude = document.querySelector('input[placeholder="Довгота"]').value;

    if (!title || !description || !selectedArea || !isPointInput(latitude, longitude)) {
      setError('Заповніть усі необхідні поля');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('userId', user.id);
      formData.append('area', selectedArea);

      if (showCoordinates) {
        if (!latitude || !longitude || !isValidFloat(latitude) || !isValidFloat(longitude)) {
          setError('Широта та довгота зазначаються у форматі числа з плаваючою точкою');
          setIsLoading(false);
          return;
        }

        formData.append('points', JSON.stringify({ latitude, longitude }));
      } else {
        formData.append('location', selectedLocation);
      }

      const body = {
        "title": title,
        "description": description,
        "area": selectedArea,
        "userId": user.id,
        "status": "Published"
      }

      const response = await fetch(`${ApiUrl}/Content`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify(body),
      });

      if (response.status === 422) {
        setError('Контент з такою назвою уже існує');
      }
      else if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentData = await response.json();
      const contentId = contentData.id; // Assuming the API returns the ID of the newly created content

      console.log("imageFile", imageFile)
      if (imageFile) {
        saveFile(imageFile, `${contentId}.${imageFile.name.split('.').pop()}`, '../../../assets/contentImages/');
      }

      console.log("audioFile", audioFile)
      if (audioFile) {
        saveFile(audioFile, `${contentId}.${audioFile.name.split('.').pop()}`, '../../../assets/contentAudios/');
      }

      console.log('Content created:', contentData);

      let point
      if(showCoordinates)
        point = {latitude: latitude, longitude: longitude, name: "default"}
      else
        point = {latitude: selectedLocation.latitude, longitude: selectedLocation.longitude, name: selectedLocation.name}

        let locationToPoint

        if(showCoordinates){
            const responseLocation = await fetch(`${ApiUrl}/Location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify(point),
            });

            if (!responseLocation.ok) {
                throw new Error(`HTTP error! Status: ${responseLocation.status}`);
            }

            locationToPoint = await responseLocation.json()
        }

      if(!locationToPoint)
        locationToPoint = selectedLocation

      const responsePoint = await fetch(`${ApiUrl}/Point`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({
            contentId: contentId,
            locationId: locationToPoint.id
        }),
      });

      if (!responsePoint.ok) {
        throw new Error(`HTTP error! Status: ${responsePoint.status}`);
      }

    } catch (error) {
      console.error('Error creating content:', error);
      setError('Не вдалося створити контент');
    } finally {
      setIsLoading(false);
      navigate('/')
    }
  };

  const saveFile = (file, fileName, path) => {
    // Logic to save the file
    console.log(`Saving file: ${fileName} to path: ${path}`);
  };

  const isValidFloat = (value) => {
    const floatRegex = /^(?!0\.00$)(?!0*$)\d*\.?\d*$/;
    return floatRegex.test(value);
  };

  const handleFloatInput = (e) => {
    const value = e.target.value;
    if (!isValidFloat(value)) {
      e.target.setCustomValidity('Введіть правильний формат широти/довготи');
    } else {
      e.target.setCustomValidity('');
    }
  };

  useEffect(() => {
    const fetchContents = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);

      try {
        const response = await fetch(`${ApiUrl}/Location`, {
          signal: abortControllerRef.current.signal,
        });
        const locationsData = await response.json();
        setLocations(locationsData);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Aborted');
          return;
        }
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

  return (
    <div className="contentEdit">
      <form onSubmit={handleSubmit}>
        <div className="imageContainer">
          <h1>Новий контент</h1>
          <span>Завантажте обкладинку:</span>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className='contentTitleBackground'></div>
        <div className='contentTitle'>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введіть назву вашого контенту..."
            required
          />
        </div>
        <div className='contentContainer'>
          <span>Завантажте аудіофайл:</span>
          <div className='contentAudio'>
            <input type="file" accept="audio/*" onChange={handleAudioChange} />
          </div>
          <div className='contentDescription'>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введіть опис вашого контенту"
              rows="4"
              required
            ></textarea>
          </div>
          <div className='contentAreaBlock'>
            <div className='areaSelect'>
              <span>Виберіть місцевість, де відбувається ваша екскурсія</span>
              <select className="" size="4" onChange={handleAreaChange} required>
                {areas.map((area, index) => (
                  <option key={index} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="pointsBlock">
            <div className='pointsBlockInformation'>
              <span>Уведіть координати або виберіть локацію зі списку</span>
              <SwitchPointLocation
                isSwitchOn={!showCoordinates}
                handleSwitchChange={() => setShowCoordinates(!showCoordinates)}
              />
            </div>
            <div className='pointsBlockData'>
              <div className={`coordinatesInput ${!showCoordinates && 'hidden'}`}>
                <input
                  type="text"
                  placeholder="Широта"
                  pattern="(\d*\.?\d+)?"
                  onInput={handleFloatInput}
                  
                />
                <input
                  type="text"
                  placeholder="Довгота"
                  pattern="(\d*\.?\d+)?"
                  onInput={handleFloatInput}
                  
                />
              </div>
              <select
                className={`locationSelect ${showCoordinates && 'hidden'}`}
                size="4"
                onChange={handleLocationChange}
                required
                >
                <option value="жодна">(жодна)</option>
                {locations.map((location, index) => (
                    location.name !== 'default' && (
                    <option key={index} value={location.name}>
                        {location.name}: {location.latitude}, {location.longitude}
                    </option>
                    )
                ))}   
              </select>
            </div>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Створення...' : 'Створити контент'}
        </button>
      </form>
    </div>
  );
}

export default ContentEdit;
