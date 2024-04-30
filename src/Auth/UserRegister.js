import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './UserLogin.css';

function UserRegister() {
  return (
    <div className="user-signin-page">
      <div className="user-signin-content">
        <div className="user-signin-box">
          <Link to="/landingPage" className="back-button"> {/* Moved inside .user-signin-box */}
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <h1 className="user-signin-title">Sign Up</h1>
          <form className="user-signin-box-form">
            <input type="email" id="email" name="email" placeholder="Email" required className="user-signin-box-input" />
            <input type="password" id="password" name="password" placeholder="Password" required className="user-signin-box-input" />
            <button type="submit" className="user-signin-box-button">Sign In</button>
          </form>
          <p className="user-signin-box-text">Already have an account? <Link to="/userLogin" className="user-signin-box-link">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}


export default UserRegister;