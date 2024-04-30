import React from 'react';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './HomePage.css';
import app from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import bigImage from '../assets/big-image.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { doc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore(app);
const auth = getAuth(app);

function HomePage() {

  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserName(docSnap.data().name);
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUser();
  }, []);

  const mapStyles = {        
    height: "500px",
    width: "1325px"
  };
  
  const defaultCenter = {
    lat: 13.41, lng: 122.56
  };
  
  console.log('Current user:', auth.currentUser);

  return (
    <div>
      <header className="homepage-header">
        <h1 className="homepage-title">React</h1>
        <div className="user-info">
          <FontAwesomeIcon icon={faUser} />
            <span>{userName || 'Guest'}</span>
          <FontAwesomeIcon icon={faCaretDown} />
        </div>
      </header>
      <div className="homepage-box">
        <LoadScript
          googleMapsApiKey='AIzaSyDxwKIHOIfYJmWAZH6E8eItwB4pN3Q-hdA'>
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={5}
            center={defaultCenter}>
            <Marker position={defaultCenter}/>
          </GoogleMap>
        </LoadScript>
      </div>
      <div className="homepage-box">
        <div className="homepage-photo-box">
          <h2>Latest Uploaded Photos</h2>
          <div className="homepage-photo-scroll">
            <img src={bigImage} alt="First uploaded" className="homepage-photo" />
            <img src={bigImage} alt="Second uploaded" className="homepage-photo" />
            <img src={bigImage} alt="Third uploaded" className="homepage-photo" />
            <img src={bigImage} alt="First uploaded" className="homepage-photo" />
            <img src={bigImage} alt="Second uploaded" className="homepage-photo" />
            <img src={bigImage} alt="Third uploaded" className="homepage-photo" />
            <img src={bigImage} alt="First uploaded" className="homepage-photo" />
            <img src={bigImage} alt="Second uploaded" className="homepage-photo" />
            <img src={bigImage} alt="Third uploaded" className="homepage-photo" />
          </div>
          <button className="homepage-button">Upload Photo</button>
        </div>
      </div>
      <footer className="footer">
        <div>
          <h1 className="homepage-title">React</h1>
        </div>
        <div className="footer-links">
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/contact">Contact Information</a>
          <p>© 2024 React - Nathan Jargon</p>
        </div>
      </footer>
    </div>
  );  
}

export default HomePage;