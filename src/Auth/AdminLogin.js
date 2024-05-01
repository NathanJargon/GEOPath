import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './UserLogin.css';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // import required functions

const auth = getAuth(); 

function AdminLogin() {
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      const db = getFirestore();
      const docRef = doc(db, 'users', email.value);
      const docSnap = await getDoc(docRef);

      console.log('User document:', docSnap.data()); // Log the user document

      if (docSnap.exists() && docSnap.data().type === 'admin') {
        await signInWithEmailAndPassword(auth, email.value, password.value); // use function directly
        console.log('Signed in successfully'); // Log a message when sign in is successful
        navigate('/homePage');
      } else {
        console.log('Sign in failed: Invalid user type'); // Log a message when sign in fails due to invalid user type
        alert("You can't use your account on a different role");
      }
    } catch (error) {
      console.log('Sign in failed:', error); // Log the error when sign in fails
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
          <p className="user-signin-box-text">Don't have an account? <Link to="/adminRegister" className="user-signin-box-link">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;