import React, { useEffect, useRef } from 'react';

const apiKey = process.env.REACT_APP_MAP_API_KEY

const GoogleMap = ({lat, lng}) => {
  const mapRef = useRef(null);

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
      const customPoint = { lat: lat, lng: lng };
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: customPoint
      });

      new window.google.maps.Marker({
        position: customPoint,
        map: map,
        title: 'Custom Point',
      });
    };

    loadGoogleMapScript();

    return () => {
      // Cleanup (if needed)
    };
  }, [lat, lng]);

  return (
    <div>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default GoogleMap;
