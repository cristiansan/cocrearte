import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Tipos de usuario
export const USER_TYPES = {
  TERAPEUTA: 'terapeuta',
  PACIENTE: 'paciente',
  ADMIN: 'admin'
};

// Registrar nuevo usuario
export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar perfil con nombre
    await updateProfile(user, {
      displayName: userData.nombre
    });

    // Crear documento del usuario en Firestore
    await setDoc(doc(db, 'usuarios', user.uid), {
      uid: user.uid,
      email: user.email,
      nombre: userData.nombre,
      tipo: userData.tipo || USER_TYPES.PACIENTE,
      telefono: userData.telefono || '',
      especialidad: userData.especialidad || '',
      activo: true,
      fechaCreacion: new Date(),
      ...userData
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return { success: false, error: error.message };
  }
};

// Iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, error: error.message };
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, error: error.message };
  }
};

// Obtener datos del usuario actual
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Escuchar cambios en el estado de autenticación
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Obtener datos completos del usuario desde Firestore
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: 'Usuario no encontrado' };
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return { success: false, error: error.message };
  }
}; 