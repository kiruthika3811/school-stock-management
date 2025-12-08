import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name,
              role: userData.role
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.email.split('@')[0],
              role: 'staff'
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        await signOut(auth);
        return { success: false, error: 'User not found in database. Please contact administrator.' };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const approveAccessRequest = async (requestId, role = 'staff') => {
    const accessRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    const request = accessRequests.find(r => r.id === requestId);
    
    if (request) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, request.email, 'password123');
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: request.name,
          email: request.email,
          role: role,
          createdAt: new Date().toISOString()
        });

        request.status = 'approved';
        localStorage.setItem('accessRequests', JSON.stringify(accessRequests));

        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const updatedNotifications = notifications.filter(n => n.requestId !== requestId);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  };

  const rejectAccessRequest = async (requestId) => {
    const accessRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    const request = accessRequests.find(r => r.id === requestId);
    
    if (request) {
      try {
        await addDoc(collection(db, 'accessRequests'), {
          name: request.name,
          email: request.email,
          status: 'rejected',
          rejectedAt: new Date().toISOString()
        });

        request.status = 'rejected';
        localStorage.setItem('accessRequests', JSON.stringify(accessRequests));

        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const updatedNotifications = notifications.filter(n => n.requestId !== requestId);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, approveAccessRequest, rejectAccessRequest }}>
      {children}
    </AuthContext.Provider>
  );
};
