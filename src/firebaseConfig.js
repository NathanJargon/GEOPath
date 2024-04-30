import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyB2jldjjKxTKopeP3n2OrZdXWc_6-BS794",
  authDomain: "reactwebsitexx-126f6.firebaseapp.com",
  databaseURL: "https://reactwebsitexx-126f6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reactwebsitexx-126f6",
  storageBucket: "reactwebsitexx-126f6.appspot.com",
  messagingSenderId: "800042128753",
  appId: "1:800042128753:web:342e773c74317f205c52d0",
  measurementId: "G-BG3FJCLX8G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;