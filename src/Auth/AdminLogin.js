import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './UserLogin.css';
import { auth } from '../firebaseConfig'; // import auth
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function AdminLogin() {
  const handleSignIn = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      const db = getFirestore();
      const docRef = doc(db, 'users', email.value);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists() && docSnap.data().type === 'admin') {
        await auth.signInWithEmailAndPassword(email.value, password.value);
        // User signed in successfully
      } else {
        // User is not a member or does not exist
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="user-signin-page">
      <div className="user-signin-content">
        <div className="user-signin-box">
        <Link to="/authPage" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span> Admin</span>
        </Link>
          <h1 className="user-signin-title">Sign In</h1>
          <form className="user-signin-box-form" onSubmit={handleSignIn}>
            <input type="email" id="email" name="email" placeholder="Email" required className="user-signin-box-input" />
            <input type="password" id="password" name="password" placeholder="Password" required className="user-signin-box-input" />
            <button type="submit" className="user-signin-box-button">Sign In</button>
          </form>
          <p className="user-signin-box-text">Don't have an account? <Link to="/userRegister" className="user-signin-box-link">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;