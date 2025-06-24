import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBzG7qc45t37BgbuRD5S-SgRpo52NpSGGA",
  authDomain: "monitor-entrenamiento-1fc15.firebaseapp.com",
  projectId: "monitor-entrenamiento-1fc15",
  storageBucket: "monitor-entrenamiento-1fc15.firebasestorage.app",
  messagingSenderId: "662506260306",
  appId: "1:662506260306:web:9497e4cbbd1826d8ca5c8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 