import React, { useEffect, useRef, useState } from 'react';
import ContentItemForMap from './ContentItemForMap';
import { renderToString } from 'react-dom/server';
import '../styles/Map.css'

const apiKey = process.env.REACT_APP_MAP_API_KEY;

const GoogleMap = ({ contents, height }) => {
  const mapRef = useRef(null);
  const [infoWindows, setInfoWindows] = useState([]);
  console.log(contents)

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
        center: { lat: 50.450912, lng: 30.522621 }
      });
    
      const newInfoWindows = contents?.map((content, index) => {
        const infoWindow = new window.google.maps.InfoWindow({
          content: renderToString(
            <ContentItemForMap
              key={index}
              name={content.title}
              location={content.area}
              time={content.time}
            />
          )
        });

        const markerIcon = {
          path: window.google.maps.SymbolPath.CIRCLE, 
          scale: 8, 
          fillColor: '#ECE3CE', 
          fillOpacity: 1,
          strokeWeight: 3, 
          strokeColor: '#4F6F52'
        };
    
        const googleMarker = new window.google.maps.Marker({
          position: { 
            lat: content.points[0].location.latitude, 
            lng: content.points[0].location.longitude
          },
          map: map,
          title: content.title,
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
  }, [contents]);

  return (
    <div className='map'>
      <div ref={mapRef} style={{ height: height, width: '100%' }}></div>
    </div>
  );
};

export default GoogleMap;
