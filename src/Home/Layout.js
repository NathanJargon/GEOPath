import React from 'react';
import './Layout.css';
import HomePage from './HomePage.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown } from '@fortawesome/free-solid-svg-icons';

function Layout() {
  const name = "Administrator"; // Replace this with the actual user's name

  return (
    <div className="layout">
      <div className="header">
        <div className="header-content">
          <h1>React Website</h1>
        </div>
        <div className="header-content">
          <div><FontAwesomeIcon icon={faUser} /></div>
          <p>{name ? name : 'Administrator'}</p>
          <FontAwesomeIcon icon={faCaretDown} />
        </div>
      </div>
      <div className="main">
        <HomePage />
      </div>
    </div>
  );
}

export default Layout;