import React, { useEffect, useState } from 'react';
import { isValidFloat } from '../../content/utils/contentUtils';
import { toast } from 'react-toastify'; // Import toast module for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import '../../../styles/Panel.css'; 

const ApiUrl = process.env.REACT_APP_API_URL;

function LocationTable() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${ApiUrl}/Location`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleFloatInput = (e) => {
    const value = e.target.value;
    if (!isValidFloat(value)) {
      e.target.setCustomValidity('Введіть правильний формат широти/довготи');
    } else {
      e.target.setCustomValidity('');
    }
  };

  const createLocation = async () => {
    if (!name || !latitude || !longitude) {
      toast.error('Будь ласка, заповніть всі поля для створення нової локації');
      return;
    }

    const body = {
      name: name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };

    try {
      const response = await fetch(`${ApiUrl}/Location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Assuming the API returns the updated list of locations, update state
      const data = await response.json();
      locations.push(data)
      setLocations(locations);

      // Clear input fields after successful creation
      setName('');
      setLatitude('');
      setLongitude('');

      // Notify success
      toast.success('Нову локацію успішно створено');
    } catch (error) {
      console.error('Error creating location:', error);
      toast.error('Помилка при створенні локації');
    }
  };

  return (
    <div className="locationTableContainer">
      <div className="coordinatesInput">
        <input
          type="text"
          placeholder="Назва"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Широта"
          pattern="(\d*\.?\d+)?"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          onInput={handleFloatInput}
        />
        <input
          type="text"
          placeholder="Довгота"
          pattern="(\d*\.?\d+)?"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          onInput={handleFloatInput}
        />
        <button className="createLocation" onClick={createLocation}>
          Створити нову локацію
        </button>
      </div>

      <div className="tableContainer">
        <table className="locationTable">
          <thead>
            <tr>
              <th>Назва</th>
              <th>Широта</th>
              <th>Довгота</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3">Loading...</td>
              </tr>
            ) : (
              locations.map((location) => (
                (location.name !== "default") && (
                <tr key={location.id}>
                  <td>{location.name}</td>
                  <td>{location.latitude}</td>
                  <td>{location.longitude}</td>
                </tr>
                )
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LocationTable;
