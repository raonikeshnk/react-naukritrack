// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNxPPd6BHoe6yi6SyCZJYeKL8-TiL9rfY",
  authDomain: "codztech-d0c2a.firebaseapp.com",
  projectId: "codztech-d0c2a",
  storageBucket: "codztech-d0c2a.appspot.com",
  messagingSenderId: "698870955160",
  appId: "1:698870955160:web:024c73e001e31328d3a4ed",
  measurementId: "G-H458NTWWCM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
