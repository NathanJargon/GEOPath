import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './Auth/AuthPage'; 
import UserLogin from './Auth/UserLogin';
import UserRegister from './Auth/UserRegister';
import AdminLogin from './Auth/AdminLogin';
import AdminRegister from './Auth/AdminRegister';
import LandingPage from './Auth/LandingPage';
import UserPage from './Home/UserPage';
import AdminPage from './Home/AdminPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/landingPage" replace />} /> 
        <Route path="/authPage" element={<AuthPage />} /> 
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/userPage" element={<UserPage />} />
        <Route path="/adminPage" element={<AdminPage />} /> 
        <Route path="/userLogin" element={<UserLogin />} /> 
        <Route path="/userRegister" element={<UserRegister />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
      </Routes>
    </Router>
  );
}

export default App;