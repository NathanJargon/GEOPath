import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './UserLogin.css';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // import required functions

const auth = getAuth(); 

function UserLogin() {
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      const db = getFirestore();
      const docRef = doc(db, 'users', email.value);
      const docSnap = await getDoc(docRef);

      console.log('Document data:', docSnap.data()); // Log the document data

      if (docSnap.exists() && docSnap.data().type === 'member') {
        await signInWithEmailAndPassword(auth, email.value, password.value); // use function directly
        console.log('Signed in successfully'); // Log a success message
        navigate('/homePage');
      } else {
        console.log('User does not exist or is not a member'); // Log an error message
        alert("You can't use your account on a different role");
      }
    } catch (error) {
      console.error('An error occurred:', error); // Log the error
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

export default UserLogin;