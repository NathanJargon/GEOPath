import React from 'react';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindowF, MarkerF } from '@react-google-maps/api';
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
import { regions } from './regions.js';

function AdminPage() {
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
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminBoxVisible, setIsAdminBoxVisible] = useState(false);
  const [overlayContent, setOverlayContent] = useState('');
  const [overlayIsVisible, setOverlayIsVisible] = useState(false);

  const showOverlay = (content) => {
    setOverlayContent(content);
    setOverlayIsVisible(true);
  };

  const hideOverlay = () => {
    setOverlayIsVisible(false);
  };

  useEffect(() => {
    if (auth.currentUser) {
      console.log('Setting user:', auth.currentUser);
      setUser(auth.currentUser);
    } else {
      console.log('auth.currentUser is null or undefined');
    }
  }, [auth.currentUser]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData) {
            setUserName(userData.name);
            setUserType(userData.type);
            // Set isAdminBoxVisible here
            setIsAdminBoxVisible(userData.type === 'admin');
          }
        } else {
          console.log('No such document!');
        }
      } else {
        setUserName('');
        setUserType(null);
        setIsAdminBoxVisible(false); // Set isAdminBoxVisible to false if there is no user
      }
      setLoading(false); 
    });

    return unsubscribe;
  }, [auth, db]);

  useEffect(() => {
    if (userType && userType === 'admin') {
      console.log('User type is admin');
      fetchPendingPhotos();
    } else {
      console.log('User type is not admin or is null or undefined');
    }
  }, [userType]);

  useEffect(() => {
    if (auth.currentUser && auth.currentUser.type && auth.currentUser.type === 'admin') {
      console.log('Fetching pending photos');
      fetchPendingPhotos();
    } else {
      console.log('auth.currentUser, auth.currentUser.type, or auth.currentUser.type is null or undefined');
    }
  }, [auth.currentUser]);

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

  const handleDeleteClick = async (photo) => {
    if (!photo || !photo.id) {
      console.error('No photo selected');
      return;
    }

    try {
      const photoRef = doc(db, 'photos', photo.id);
      await deleteDoc(photoRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      return;
    }

    // Fetch the photos again after a photo is deleted
    fetchPhotos();
    fetchPendingPhotos();

    // Hide the overlay
    setIsBoxVisible(false);
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
              url: downloadURL,
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
    const photos = photoSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPhotos(photos);
  };

  useEffect(() => {
    setIsAdminBoxVisible(true);
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
    const fetchUser = async () => {
      if (auth.currentUser) {
        console.log('Fetching user:', auth.currentUser.email);
        const docRef = doc(db, 'users', auth.currentUser.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log('User document exists');
          setUserName(docSnap.data().name);
          setUserType(docSnap.data().type); // Ensure that the user type is being set correctly
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('auth.currentUser is null or undefined');
      }
    };

    fetchUser();
  }, [auth.currentUser]); // Add auth.currentUser to the dependency array

  const handleApproveClick = async (photo) => {
    if (userType === 'admin' && auth.currentUser) {
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
    if (userType === 'admin' && auth.currentUser) {
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
    width: "100%"
  };
  
  const defaultCenter = {
    lat: 13.41, lng: 122.56
  };
  
  console.log('Current user:', auth.currentUser);

  if (loading) {
    return <div>Loading...</div>; 
  }

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
        <LoadScript googleMapsApiKey='AIzaSyB2jldjjKxTKopeP3n2OrZdXWc_6-BS794'>
          <GoogleMap mapContainerStyle={mapStyles} zoom={4} center={defaultCenter} className="map-container">
            {regions.map((region, index) => {
              console.log('Region:', region); // Add this line
              return (
                <MarkerF 
                  key={index} 
                  position={{ lat: region.lat, lng: region.lng }}
                  onClick={() => {
                    setSelectedRegion(region);
                  }}
                />
              );
            })}

          {selectedRegion && (
            <InfoWindowF
              position={{ lat: selectedRegion.lat, lng: selectedRegion.lng }}
              onCloseClick={() => {
                setSelectedRegion(null);
              }}
            >
              <div>
                <h4>{selectedRegion.name}</h4>
                <p>{selectedRegion.info}</p>
                <p><strong>Hazards:</strong> {selectedRegion.hazards.join(', ')}</p>
              </div>
            </InfoWindowF>
          )}
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
                  {isAdminBoxVisible && (
                    <button 
                      className="homepage-button" 
                      style={{backgroundColor: 'red', color: 'white', marginRight: '175px'}} 
                      onClick={() => handleDeleteClick(currentPhoto)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        
      </div>
    </div>

    <div className="homepage-box" style={{ display: isAdminBoxVisible ? 'block' : 'none' }}>
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
              </div>
            </div>
          </div>
        )}
      </div>
    
      <footer className="footer">
        <div>
          <h1 className="website-title"></h1>
        </div>
        <div className="footer-links">
          <button onClick={() => showOverlay('Terms of Service')}>Terms of Service</button>
          <button onClick={() => showOverlay('Privacy Policy')}>Privacy Policy</button>
          <button onClick={() => showOverlay('Contact Information')}>Contact Information</button>
          <p>© 2024 React - Nathan Jargon</p>
        </div>
      </footer>
      {overlayIsVisible && (
        <div className="overlay-box">
          <div className="overlay-content">
            <button 
              className="homepage-button" 
              style={{position: 'absolute', height: '30px', top: '10px', padding: '10px', right: '10px', backgroundColor: 'black', color: 'white'}} 
              onClick={hideOverlay}
            >
              Close
            </button>
            <h2 className="overlay-title">{overlayContent}</h2>
            <p className="overlay-description">This is a placeholder description for {overlayContent}.</p>
          </div>
        </div>
      )}
    </div>
  );
}


export default AdminPage;