import React, { useState, useRef, useEffect, useContext } from 'react';
import '../../../styles/ContentEdit.css';
import DummyImage from '../../../assets/dummy.jpg';
import SwitchPointLocation from '../../../components/SwitchPointLocation';
import { getAreas } from '../../../assets/Area';
import { UserContext } from '../../../context/UserContext';

const ApiUrl = process.env.REACT_APP_API_URL;
const defaultUserId = 'default_user_id'; // You can change this default user ID as needed

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
  const {user} = useContext(UserContext)

  const abortControllerRef = useRef(null);

  const areas = getAreas();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError('Фото має бути меншим за 5 МБайт');
      return;
    }
    setImageFile(file);
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 100 * 1024 * 1024) {
      setError('Аудіофайл має бути менший за 100МБайт.');
      return;
    }
    setAudioFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !selectedArea || (!showCoordinates && !selectedLocation)) {
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
        const latitude = document.querySelector('input[placeholder="Широта"]').value;
        const longitude = document.querySelector('input[placeholder="Довгота"]').value;

        if (!latitude || !longitude || !isValidFloat(latitude) || !isValidFloat(longitude)) {
          setError('Широта та довгота зазначаються у форматі числа з плаваючою точкою');
          setIsLoading(false);
          return;
        }

        formData.append('points', JSON.stringify({ latitude, longitude }));
      } else {
        formData.append('location', selectedLocation);
      }

      const response = await fetch(`${ApiUrl}/Content`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      const contentId = responseData.id; // Assuming the API returns the ID of the newly created content

      if (imageFile) {
        saveFile(imageFile, `${contentId}.${imageFile.name.split('.').pop()}`, '../../../assets/contentImages/');
      }

      if (audioFile) {
        saveFile(audioFile, `${contentId}.${audioFile.name.split('.').pop()}`, '../../../assets/contentAudios/');
      }

      console.log('Content created:', responseData);
    } catch (error) {
      console.error('Error creating content:', error);
      setError('Error creating content. Please try again.');
    } finally {
      setIsLoading(false);
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
              <select className="" size="4" required>
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
                  pattern="\d*\.?\d*" // Allows only numbers and dot
                  onInput={handleFloatInput}
                  required
                />
                <input
                  type="text"
                  placeholder="Довгота"
                  pattern="\d*\.?\d*" // Allows only numbers and dot
                  onInput={handleFloatInput}
                  required
                />
              </div>
              <select className={`locationSelect ${showCoordinates && 'hidden'}`} size="4" required>
                <option value="" disabled selected>(жодна)</option>
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
