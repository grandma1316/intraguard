import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../services/firebase';
import { authAPI, notificationAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from database
          const userRef = ref(database, `Users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          const userData = snapshot.val() || {};
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userData
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Request notification permission and store token
      const token = await requestNotificationPermission();
      if (token) {
        await notificationAPI.storeFCMToken({
          email: userCredential.user.email,
          fcm_token: token
        });
      }
      
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name, city) => {
    try {
      setError(null);
      setLoading(true);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName: name });
      
      // Store additional user data in database
      const userRef = ref(database, `Users/${userCredential.user.uid}`);
      await set(userRef, {
        email,
        name,
        city,
        createdAt: new Date().toISOString(),
        fcmTokens: {}
      });
      
      // Request notification permission and store token
      const token = await requestNotificationPermission();
      if (token) {
        await notificationAPI.storeFCMToken({
          email,
          fcm_token: token
        });
      }
      
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // You'll need to implement getToken from firebase/messaging
        // const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
        // return token;
        return null;
      }
      return null;
    } catch (error) {
      console.error('Error getting notification permission:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 