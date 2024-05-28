import React, { useEffect, useRef, useState } from 'react';
import ContentItemLittle from './ContentItemLittle';
import DummyImage from '../assets/dummy.jpg';
import { renderToString } from 'react-dom/server';

const apiKey = process.env.REACT_APP_MAP_API_KEY;

const GoogleMap = ({ markers, height }) => {
  const mapRef = useRef(null);
  const [infoWindows, setInfoWindows] = useState([]);

  useEffect(() => {
    const loadGoogleMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: markers?.length ? { lat: markers[0].lat, lng: markers[0].lng } : { lat: 50.45, lng: 30.47 }
      });
    
      const newInfoWindows = markers?.map((marker, index) => {
        const infoWindow = new window.google.maps.InfoWindow({
          content: renderToString(
            <ContentItemLittle
              key={index}
              image={marker.image}
              name={marker.name}
              location={marker.location}
              time={marker.time}
            />
          )
        });

        const markerIcon = {
          path: window.google.maps.SymbolPath.CIRCLE, // Use predefined symbol for a circle
          scale: 8, // Adjust the size of the circle
          fillColor: '#ECE3CE', // Fill color of the circle
          fillOpacity: 1, // Opacity of the circle
          strokeWeight: 3, // No border
          strokeColor: '#4F6F52'
        };
    
        const googleMarker = new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng }, // Use current marker's position
          map: map,
          title: marker.name,
          icon: markerIcon
        });
    
        googleMarker.addListener('click', () => {
          closeAllInfoWindowsExcept(newInfoWindows);
          infoWindow.open(map, googleMarker);
          
        });
    
        return { marker: googleMarker, infoWindow };
      });
    
      setInfoWindows(newInfoWindows);
    };
    

    const closeAllInfoWindowsExcept = (newInfoWindows) => {
      newInfoWindows.forEach(({ infoWindow }) => {
          infoWindow.close();
      });
    };

    loadGoogleMapScript();

    return () => {
      // Cleanup (if needed)
    };
  }, [markers]);

  return (
    <div className='map'>
      <div ref={mapRef} style={{ height: height, width: '100%' }}></div>
    </div>
  );
};

export default GoogleMap;
