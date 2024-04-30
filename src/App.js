import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Home/Layout'; 
import AuthPage from './Auth/AuthPage'; 
import UserLogin from './Auth/UserLogin';
import UserRegister from './Auth/UserRegister';
import AdminLogin from './Auth/AdminLogin';
import AdminRegister from './Auth/AdminRegister';
import LandingPage from './Auth/LandingPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/landingPage" replace />} /> // Change this line
        <Route path="/authPage" element={<AuthPage />} /> 
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/homePage" element={<Layout />} /> 
        <Route path="/userLogin" element={<UserLogin />} /> 
        <Route path="/userRegister" element={<UserRegister />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
      </Routes>
    </Router>
  );
}

export default App;