import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBK_W-Y-dxl7ew0GXnnpj0wS6BxrsliHyo",
  authDomain: "school-management-63b8b.firebaseapp.com",
  databaseURL: "https://school-management-63b8b-default-rtdb.firebaseio.com",
  projectId: "school-management-63b8b",
  storageBucket: "school-management-63b8b.firebasestorage.app",
  messagingSenderId: "679965494946",
  appId: "1:679965494946:web:1723c69e762286c62691fb",
  measurementId: "G-CV1BV0K8J4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const createAdminUser = async () => {
  try {
    console.log('Creating admin user...');
    
    const userCredential = await createUserWithEmailAndPassword(auth, 'admin@school.com', 'password123');
    const user = userCredential.user;
    
    await setDoc(doc(db, 'users', user.uid), {
      name: 'School Administrator',
      email: 'admin@school.com',
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@school.com');
    console.log('Password: password123');
    console.log('Role: admin');
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️ Admin user already exists');
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
  }
};

createAdminUser();