import React, { useState, useRef, useEffect, useContext } from 'react';
import '../../../styles/ContentEdit.css';
import DummyImage from '../../../assets/dummy.jpg';
import SwitchPointLocation from '../../../components/SwitchPointLocation';
import { getAreas } from '../../../assets/Area';
import { UserContext } from '../../../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import { isValidFloat } from '../utils/contentUtils';
import { FillContentWithMedia } from '../../../utils/tempUtil';
import { toast } from 'react-toastify';

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
  const [contents, setContents] = useState()
  const [error, setError] = useState('');
  const [point, setPoint] = useState({ latitude: '', longitude: '' }); // Initialize with default values

  const navigate = useNavigate();
  const {user} = useContext(UserContext)
  const { contentId } = useParams()

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

      if (showCoordinates) {
        if (!latitude || !longitude || !isValidFloat(latitude) || !isValidFloat(longitude)) {
          setError('Широта та довгота зазначаються у форматі числа з плаваючою точкою');
          setIsLoading(false);
          return;
        }
      }

      const body = {
        "title": title,
        "description": description,
        "area": selectedArea,
        "status": "Published"
      }

      const response = await fetch(`${ApiUrl}/Content/${contentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let contentData = await response.json();
      contentData = (await FillContentWithMedia([contentData]))[0]
      setContents(contentData)

      console.log('Content updated:', contentData);

      if(showCoordinates) {
        if(contentData.points[0].location.name === "default"){
            const contentPoint = {latitude: latitude, longitude: longitude, name: "default"}
            console.log(contentData)
            const responseLocation = await fetch(`${ApiUrl}/Location/${contentData.points[0].location.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify(contentPoint),
            });

            if (!responseLocation.ok) {
                throw new Error(`HTTP error! Status: ${responseLocation.status}`);
            }
        }
        else {
            const contentPoint = {latitude: latitude, longitude: longitude, name: "default"}
            const responseLocation = await fetch(`${ApiUrl}/Location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify(contentPoint),
            });

            if (!responseLocation.ok) {
                throw new Error(`HTTP error! Status: ${responseLocation.status}`);
            }

            const locationToPoint = await responseLocation.json()

            const responsePoint = await fetch(`${ApiUrl}/Point/${contentData.points[0].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify({
                    locationId: locationToPoint.id
                }),
            });
    
            if (!responsePoint.ok) {
                throw new Error(`HTTP error! Status: ${responsePoint.status}`);
            }
        }
      }
      else {
        const responsePoint = await fetch(`${ApiUrl}/Point/${contentData.points[0].id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({
                locationId: selectedLocation.id
            }),
        });

        if (!responsePoint.ok) {
            throw new Error(`HTTP error! Status: ${responsePoint.status}`);
        }
      }
    } catch (error) {
      console.error('Error creating content:', error);
      setError('Не вдалося оновити контент');
      toast.error('Не вдалося оновити контент');
    } finally {
      setIsLoading(false);
      navigate(`/content/${contentId}`)
      window.location.reload();        
    }
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
        const responseLocations = await fetch(`${ApiUrl}/Location`, {
          signal: abortControllerRef.current.signal,
        });
        const locationsData = await responseLocations.json();
        setLocations(locationsData);

        const responseContent = await fetch(`${ApiUrl}/Content/${contentId}`, {
            signal: abortControllerRef.current.signal,
          });
          let contentData = await responseContent.json();
          contentData = (await FillContentWithMedia([contentData]))[0]
          setContents(contentData);
          if(contentData){
            setTitle(contentData.title)
            setDescription(contentData.description)
            setImageFile(contentData.image)
            setAudioFile(contentData.audioFile)
            setSelectedArea(contentData.area)
            if(contentData.points[0].location.name !== "default"){
                setShowCoordinates(false)
                setSelectedLocation(contentData.points[0].location)
            }
            else {
                setShowCoordinates(true)
                setPoint({
                    latitude: contentData.points[0].location.latitude,
                    longitude: contentData.points[0].location.longitude
                })
            }
          }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Aborted');
          return;
        }
        toast.error('Щось пішло не так');
        setError(err.message); // Set the error message instead of the whole error object
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, []);

  return (
      <form onSubmit={handleSubmit} className="contentEdit">
        <div className="imageContainer">
          <img 
            src={imageFile ? imageFile : DummyImage} 
            alt={title} 
            className="contentImage" 
            />
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
          <input type="file" accept="image/*" onChange={handleImageChange} />
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
              <select className="" size="4" onChange={handleAreaChange} value={selectedArea || ''} required>
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
                  defaultValue={point && point.latitude !== undefined ? point.latitude : ''}
                  />
                <input
                  type="text"
                  placeholder="Довгота"
                  pattern="(\d*\.?\d+)?"
                  onInput={handleFloatInput}
                  defaultValue={point && point.longitude !== undefined ? point.longitude : ''}
                  />
              </div>
              <select
                className={`locationSelect ${showCoordinates && 'hidden'}`}
                size="4"
                onChange={handleLocationChange}
                value={selectedLocation.name || ''}
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Оновлення...' : 'Оновити'}
        </button>
      </form>
  );
}

export default ContentEdit;
