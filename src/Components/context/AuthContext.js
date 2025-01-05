// src/Components/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../Firebase/firebase'; // Your Firebase auth config
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

// Initialize Firestore
const firestore = getFirestore(); // Initialize Firestore instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          setCurrentUser(user);
          setIsEmailVerified(true);

          // Fetch user role from Firestore if needed
          const fetchUserRole = async () => {
            const userRef = doc(firestore, 'ntusers', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              setUserRole(userDoc.data().role);
            }
          };

          fetchUserRole();
        } else {
          setCurrentUser(null); // If email is not verified, reset user state
          setUserRole('');
          setIsEmailVerified(false);
        }
      } else {
        setCurrentUser(null);
        setUserRole('');
        setIsEmailVerified(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userRole, isEmailVerified, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext); // Return the context value
};
