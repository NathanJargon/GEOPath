import React from 'react';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './HomePage.css';
import app from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import bigImage from '../assets/big-image.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';

function HomePage() {
  const navigate = useNavigate();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [userName, setUserName] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPendingBoxVisible, setIsPendingBoxVisible] = useState(false);
  const [currentPendingPhoto, setCurrentPendingPhoto] = useState(null);
  const [userType, setUserType] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.email);
        const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Document ID:', docRef.id); // Log the document ID
        console.log('Document data:', docSnap.data()); // Log all the fields of the document

        setUserName(docSnap.data().name);
        setUserType(docSnap.data().type);

        // Fetch the pending photos if the user is an admin
        if (docSnap.data().type === 'admin') {
          fetchPendingPhotos();
        }
      } else {
        console.log('No such document!');
      }
      } else {
        setUserName('');
        setUserType(null);
      }
    });

    // Clean up the listener when the component is unmounted
    return unsubscribe;
  }, [auth, db]);
  
  useEffect(() => {
    if (userType === 'admin') {
      fetchPendingPhotos();
    }
  }, [userType]);

  const handleImageClick = (photo, isPending) => {
    if (isPending) {
      setCurrentPendingPhoto(photo);
      setIsPendingBoxVisible(true);
    } else {
      setCurrentPhoto(photo);
      setIsBoxVisible(true);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      navigate('/landingPage');
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    }
  };

  const handleCloseClick = () => {
    setIsBoxVisible(false);
  };

  const handleUploadClick = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      const storage = getStorage(app);
      const storageRef = ref(storage, `photos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // You can add code here to handle the progress of the upload
        }, 
        (error) => {
          console.error(error);
        }, 
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const randomId = uuidv4(); // Generate a random ID
            await setDoc(doc(db, 'photos', randomId), { // Use the random ID as the document ID
              id: randomId, // Include the random ID in the document data
              imageUrl: downloadURL,
              title: '',
              description: '',
              type: 'pending',
              userEmail: auth.currentUser.email
            });
            // Fetch the photos again after a new photo is uploaded
            fetchPhotos();
            fetchPendingPhotos();
            alert('Your image has been uploaded! It will be verified by an admin soon.');
          } catch (error) {
            console.error(error);
            alert('An error occurred.');
          }
        }
      );
    };
    fileInput.click();
  };

  const fetchPhotos = async () => {
    const photosCollection = collection(db, 'photos');
    const q = query(photosCollection, where('type', '==', 'verified'));
    const photoSnapshots = await getDocs(q);
    const photos = photoSnapshots.docs.map(doc => doc.data());
    setPhotos(photos);
  };

  useEffect(() => {
    fetchPhotos();
    fetchPendingPhotos();
  }, []);

  const fetchPendingPhotos = async () => {
    try {
      const photosCollection = collection(db, 'photos');
      const q = query(photosCollection, where('type', '==', 'pending'));
      const photoSnapshots = await getDocs(q);
      const photos = photoSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Pending photos:', photos); // Add this line to log the fetched pending photos
      setPendingPhotos(photos);

      // Set isPendingBoxVisible to true if there are any pending photos
      if (photos.length > 0) {
        setIsPendingBoxVisible(true);
      }
    } catch (error) {
      console.error('An error occurred while fetching the pending photos:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handlePendingCloseClick = () => {
    setIsPendingBoxVisible(false);
  };

  useEffect(() => {
    if (auth.currentUser && auth.currentUser.type === 'admin') {
      fetchPendingPhotos();
    }
  }, [auth.currentUser]);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserName(docSnap.data().name);
          // Add this line to fetch the 'type' field
          auth.currentUser.type = docSnap.data().type;
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUser();
  }, []);

  const handleApproveClick = async (photo) => {
    if (userType === 'admin') {
    try {
      const userQuery = query(collection(db, 'users'), where('email', '==', auth.currentUser.email));
      const userQuerySnapshot = await getDocs(userQuery);
      if (!userQuerySnapshot.empty) {
        const userSnap = userQuerySnapshot.docs[0];
        if (userSnap.data().type === 'admin') {
          const photoRef = doc(db, 'photos', photo.id);
          await updateDoc(photoRef, { type: 'verified' });
          fetchPendingPhotos();
          fetchPhotos();
          handlePendingCloseClick();
        } else {
          console.error('The current user is not an admin.');
        }
      } else {
        console.error('The user document does not exist.');
      }
    } catch (error) {
      console.error('An error occurred while approving the photo:', error);
    }
    } else {
      console.error('The current user is not an admin.');
    }
  };

  const handleRejectClick = async (photo) => {
    if (userType === 'admin') {
    try {
      const userQuery = query(collection(db, 'users'), where('email', '==', auth.currentUser.email));
      const userQuerySnapshot = await getDocs(userQuery);
      if (!userQuerySnapshot.empty) {
        const userSnap = userQuerySnapshot.docs[0];
        if (userSnap.data().type === 'admin') {
          const photoRef = doc(db, 'photos', photo.id);
          await deleteDoc(photoRef);
          fetchPendingPhotos();
          handlePendingCloseClick();
        } else {
          console.error('The current user is not an admin.');
        }
      } else {
        console.error('The user document does not exist.');
      }
    } catch (error) {
      console.error('An error occurred while rejecting the photo:', error);
    }
    } else {
      console.error('The current user is not an admin.');
    }
  };

  const mapStyles = {        
    height: "500px",
    width: "1325px"
  };
  
  const defaultCenter = {
    lat: 13.41, lng: 122.56
  };
  
  console.log('Current user:', auth.currentUser);

  return (
    <div>
      <header className={`homepage-header ${isScrolled ? 'scrolled' : ''}`}>
        <h1 className="homepage-title">React</h1>
        <div className="user-info">
          <FontAwesomeIcon icon={faUser} onClick={() => setDropdownOpen(!dropdownOpen)} />
          <span>{userName || 'Guest'}</span>
          <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" onClick={() => setDropdownOpen(!dropdownOpen)} />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item logout" onClick={handleLogoutClick}>Logout</button>
            </div>
          )}
        </div>
      </header>
      <div className="homepage-box">
      <LoadScript
        googleMapsApiKey='AIzaSyDxwKIHOIfYJmWAZH6E8eItwB4pN3Q-hdA'>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={5}
          center={defaultCenter}>
          <Marker position={defaultCenter}/>
        </GoogleMap>
      </LoadScript>
    </div>
    <div className="homepage-box">
      <div className="homepage-photo-box">
        <h2>Latest Uploaded Photos</h2>
        <div className="homepage-photo-scroll">
          {photos.map((photo, index) => (
            photo.type === 'verified' && (
            <img
              key={index}
              src={photo.url}
              alt={`Uploaded photo ${index + 1}`}
              className="homepage-photo"
              onClick={() => handleImageClick(photo, false)} // Pass false to indicate that this is not a pending photo
            />
            )
          ))}
        </div>
        <button className="homepage-button" onClick={handleUploadClick}>Upload Photo</button>
        {isBoxVisible && currentPhoto && (
        <div className="overlay-box">
          <div className="overlay-content">
            <img src={currentPhoto.url} alt={currentPhoto.title} className="overlay-image" />
                <div className="overlay-text">
                <button 
                className="homepage-button" 
                style={{backgroundColor: 'black', color: 'white'}} 
                onClick={handleCloseClick}
              >
                Close
              </button>
                <h2 className="overlay-title">{currentPhoto ? currentPhoto.title : ''}</h2>
                <p className="overlay-description">{currentPhoto ? currentPhoto.description : ''}</p>
            </div>
            </div>
          </div>
        )}
        
      </div>
    </div>

  {auth.currentUser.type === 'admin' && (
    <div className="homepage-box">
      <h2>Pending Photos</h2>
      <div className="homepage-photo-scroll">
        {pendingPhotos.map((photo, index) => (
          <img
            key={index}
            src={photo.imageUrl} 
            alt={`Pending photo ${index + 1}`}
            className="homepage-photo"
            onClick={() => handleImageClick(photo, true)} // Pass true to indicate that this is a pending photo
          />
        ))}
      </div>
      {isPendingBoxVisible && currentPendingPhoto && (
        <div className="overlay-box">
          <div className="overlay-content">
            <img src={currentPendingPhoto ? currentPendingPhoto.imageUrl : ''} alt={currentPendingPhoto ? currentPendingPhoto.title : ''} className="overlay-image" />
              <div className="overlay-text">
                <button 
                  className="homepage-button" 
                  style={{position: 'absolute', height: '100px', top: '10px', right: '10px', backgroundColor: 'black', color: 'white'}} 
                  onClick={handlePendingCloseClick}
                >
                  Close
                </button>
                <button 
                  className="homepage-button" 
                  style={{backgroundColor: 'green', color: 'white', marginRight: '175px'}} /* Added marginRight */
                  onClick={() => handleApproveClick(currentPendingPhoto)}
                >
                  Approve
                </button>
                <button 
                  className="homepage-button" 
                  style={{backgroundColor: 'red', color: 'white'}} 
                  onClick={() => handleRejectClick(currentPendingPhoto)}
                >
                  Reject
                </button>
                  <h2 className="overlay-title">{currentPendingPhoto ? currentPendingPhoto.title : ''}</h2>
                  <p className="overlay-description">{currentPendingPhoto ? currentPendingPhoto.description : ''}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )}
      <footer className="footer">
        <div>
          <h1 className="homepage-title"></h1>
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

export default HomePage;