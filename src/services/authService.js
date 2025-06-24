import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Solo terapeutas
export const USER_TYPE = 'terapeuta';

// Registrar nuevo terapeuta
export const registerTherapist = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar perfil con nombre
    await updateProfile(user, {
      displayName: userData.nombre
    });

    // Crear documento del terapeuta en Firestore
    await setDoc(doc(db, 'terapeutas', user.uid), {
      uid: user.uid,
      email: user.email,
      nombre: userData.nombre,
      tipo: USER_TYPE,
      telefono: userData.telefono || '',
      especialidad: userData.especialidad || '',
      activo: true,
      fechaCreacion: new Date(),
      ...userData
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error al registrar terapeuta:', error);
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

// Obtener datos completos del terapeuta desde Firestore
export const getTherapistData = async (uid) => {
  try {
    const therapistDoc = await getDoc(doc(db, 'terapeutas', uid));
    if (therapistDoc.exists()) {
      return { success: true, data: therapistDoc.data() };
    } else {
      return { success: false, error: 'Terapeuta no encontrado' };
    }
  } catch (error) {
    console.error('Error al obtener datos del terapeuta:', error);
    return { success: false, error: error.message };
  }
}; 