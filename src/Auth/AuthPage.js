import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import app from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

const auth = getAuth(app);

function AuthPage() {
  const navigate = useNavigate();

  const navigateToUserPage = () => {
    navigate('/userLogin');
  };

  const navigateToAdminPage = () => {
    navigate('/adminLogin');
  };

  const navigateToLandingPage = () => {
    navigate('/landingPage');
  }

  return (
    <div>
      <header className="header">
        <h1 className="website-title" onClick={navigateToLandingPage}>React</h1>
      </header>
      <div className="role-selection">
        <h2>Choose your role</h2>
        <p>You can't switch roles with the same account</p>
      </div>
      <div className="role-boxes">
        <div className="role-box">
        <div className="title-box">
            <h3>Member</h3>
            <FontAwesomeIcon icon={faUser} />
            <p className="box-smallText">Be able to upload photos and interact with the website.</p>
        </div>
        <button className="role-button" style={{backgroundColor: 'lightblue'}} onClick={navigateToUserPage}>Log in as a User</button>
        </div>
        <div className="role-box">
        <div className="title-box">
            <h3>Administrator</h3>
            <FontAwesomeIcon icon={faUserShield} />
            <p className="box-smallText">Be able to manage uploaded photos and interact with the website.</p>
        </div>
        <button className="role-button" style={{backgroundColor: 'lightcoral'}} onClick={navigateToAdminPage}>Log in as an Admin</button>
        </div>
      </div>
      <footer className="footer">
          <div>
              <h1 className="website-title" onClick={navigateToLandingPage}>React</h1>
              <p>© 2024 React - Nathan Jargon</p>
          </div>
          <div className="footer-links">
              <a href="/terms">Terms of Service</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/contact">Contact Information</a>
          </div>
      </footer>
    </div>
  );  
}

export default AuthPage;