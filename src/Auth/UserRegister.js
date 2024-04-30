import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './UserLogin.css';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Updated import statement

const auth = getAuth();
function UserRegister() {
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    console.log('handleSignUp called'); 
    event.preventDefault();
    const { name, email, password } = event.target.elements;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const db = getFirestore();
      await setDoc(doc(db, 'users', email.value), {
        name: name.value,
        email: email.value,
        password: password.value,
        type: 'member'
      });
      alert("Account created successfully");
      navigate('/userLogin');
    } catch (error) {
      console.log('Error in handleSignUp:', error);
    }
  };

  return (
    <div className="user-signin-page">
      <div className="user-signin-content">
        <div className="user-signin-box">
          <Link to="/authPage" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} />
            <span> Member</span>
          </Link>
          <h1 className="user-signin-title">Sign Up</h1>
          <form className="user-signin-box-form" onSubmit={handleSignUp}>
            <input type="text" id="name" name="name" placeholder="Name" required className="user-signin-box-input" />
            <input type="email" id="email" name="email" placeholder="Email" required className="user-signin-box-input" />
            <input type="password" id="password" name="password" placeholder="Password" required className="user-signin-box-input" />
            <button type="submit" className="user-signin-box-button">Sign Up</button>
          </form>
          <p className="user-signin-box-text">Already have an account? <Link to="/userLogin" className="user-signin-box-link">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;