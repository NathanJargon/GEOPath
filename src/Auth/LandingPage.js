import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import app from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

const auth = getAuth(app);

function LandingPage() {
  const navigate = useNavigate();

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
              <a href="/terms">Terms of Service</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/contact">Contact Information</a>
              <p>© 2024 React - Nathan Jargon</p>
          </div>
      </footer>
    </div>
  );  
}

export default LandingPage;