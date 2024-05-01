import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import app from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

const auth = getAuth(app);

function LandingPage() {
  const navigate = useNavigate();
  const [overlayContent, setOverlayContent] = useState('');
  const [overlayIsVisible, setOverlayIsVisible] = useState(false);

  const showOverlay = (content) => {
    setOverlayContent(content);
    setOverlayIsVisible(true);
  };

  const hideOverlay = () => {
    setOverlayIsVisible(false);
  };
  
  const navigateToAuthPage = () => {
    navigate('/authPage');
  };



  return (
    <div>
      <header className="header">
        <h1 className="website-title">React</h1>
      </header>
      <div className="landing-page-box">
        <div className="landing-page-header">
          <h2 style={{maxWidth: '65%'}}>Navigate locations and share hazardous images online</h2>
          <p>Share images and navigate whenever you want—all it takes is an internet!</p>
        </div>
        <button className="landing-page-button" onClick={navigateToAuthPage}>Get Started</button>
      </div>
      <footer className="footer">
        <div>
          <h1 className="website-title"></h1>
        </div>
        <div className="footer-links">
          <button onClick={() => showOverlay('Terms of Service')}>Terms of Service</button>
          <button onClick={() => showOverlay('Privacy Policy')}>Privacy Policy</button>
          <button onClick={() => showOverlay('Contact Information')}>Contact Information</button>
          <p>© 2024 React - Nathan Jargon</p>
        </div>
      </footer>
      {overlayIsVisible && (
        <div className="overlay-box">
          <div className="overlay-content">
            <button 
              className="homepage-button" 
              style={{position: 'absolute', height: '100px', top: '10px', right: '10px', backgroundColor: 'black', color: 'white'}} 
              onClick={hideOverlay}
            >
              Close
            </button>
            <h2 className="overlay-title">{overlayContent}</h2>
            <p className="overlay-description">This is a placeholder description for {overlayContent}.</p>
          </div>
        </div>
      )}
    </div>
  );
}


export default LandingPage;