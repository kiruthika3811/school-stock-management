import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Package } from 'lucide-react';

const SetupUsers = () => {
  const [status, setStatus] = useState('');

  const createInitialUsers = async () => {
    setStatus('Setting up users in Firestore...');
    const users = [
      { email: 'admin@school.com', password: 'password', name: 'Admin User', role: 'admin' },
      { email: 'manager@school.com', password: 'password', name: 'Manager User', role: 'manager' },
      { email: 'staff@school.com', password: 'password', name: 'Staff User', role: 'staff' }
    ];

    for (const user of users) {
      try {
        let uid;
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
          uid = userCredential.user.uid;
        } catch (authError) {
          if (authError.code === 'auth/email-already-in-use') {
            const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
            uid = userCredential.user.uid;
            await signOut(auth);
          } else {
            throw authError;
          }
        }
        
        await setDoc(doc(db, 'users', uid), {
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: new Date().toISOString()
        });
        setStatus(prev => prev + `\n✓ Added ${user.email} to Firestore`);
      } catch (error) {
        setStatus(prev => prev + `\n✗ Error with ${user.email}: ${error.message}`);
      }
    }
    setStatus(prev => prev + '\n\nSetup complete! You can now sign in.');
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <Package className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Setup Users</h1>
          <p className="text-gray-500 text-sm">Initialize Firebase with test users</p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">This will add user data to Firestore:</p>
            <ul className="text-sm space-y-1">
              <li>• admin@school.com (Admin)</li>
              <li>• manager@school.com (Manager)</li>
              <li>• staff@school.com (Staff)</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">Password for all: password</p>
          </div>

          <button
            onClick={createInitialUsers}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
          >
            Setup Users in Firestore
          </button>

          {status && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-xs whitespace-pre-wrap">{status}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupUsers;
