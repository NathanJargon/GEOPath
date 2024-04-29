import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './Homepage.css';

function HomePage() {
  const mapStyles = {        
    height: "70vh",
    width: "70vh",
    borderRadius: "15px"
  };
  
  const defaultCenter = {
    lat: 13.41, lng: 122.56
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <LoadScript
            googleMapsApiKey='AIzaSyDxwKIHOIfYJmWAZH6E8eItwB4pN3Q-hdA'>
            <GoogleMap
              mapContainerStyle={mapStyles}
              zoom={5}
              center={defaultCenter}>
              <Marker position={defaultCenter}/>
            </GoogleMap>
          </LoadScript>
          <div className="photo-box">
            <h2>Latest Uploaded Photos</h2>
            <div className="photo-scroll">
              {/* Replace this with your photos */}
              <img src="photo1.jpg" alt="Photo 1" />
              <img src="photo2.jpg" alt="Photo 2" />
              <img src="photo3.jpg" alt="Photo 3" />
            </div>
          <button className="button">Upload Photo</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default HomePage;