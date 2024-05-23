import React from 'react';
import '../styles/Map.css';

/*
<iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47059.9903284531!2d-122.41941598361678!3d37.77492948705143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1645335378653!5m2!1sen!2sin"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0, borderRadius: '15px' }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
*/

function Map() {
  return (
    <div className="mapContainer">
      {/* Map block */}
      <div className="mapBlock">
        {/* Your map component (e.g., Google Maps embed, or any other map library) */}
        
      </div>

      {/* Buttons */}
      <div className="buttonContainer">
        <button className="openButton">Open in Google Maps</button>
      </div>
    </div>
  );
}

export default Map;