// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBzG7qc45t37BgbuRD5S-SgRpo52NpSGGA",
    authDomain: "monitor-entrenamiento-1fc15.firebaseapp.com",
    projectId: "monitor-entrenamiento-1fc15",
    storageBucket: "monitor-entrenamiento-1fc15.firebasestorage.app",
    messagingSenderId: "662506260306",
    appId: "1:662506260306:web:9497e4cbbd1826d8ca5c8b",
    measurementId: "G-K6DP04D3M7"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Exportar para uso global
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseStorage = storage; 