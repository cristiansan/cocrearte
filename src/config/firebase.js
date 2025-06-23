import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA8o-63pwyl-32b5_TjDd16Avc6Pa6_yAU",
  authDomain: "espacio-cocrearte.firebaseapp.com",
  projectId: "espacio-cocrearte",
  storageBucket: "espacio-cocrearte.firebasestorage.app",
  messagingSenderId: "879735027281",
  appId: "1:879735027281:web:18e1b44e945960be1cea70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 