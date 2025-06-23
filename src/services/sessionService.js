import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Estados de sesión
export const SESSION_STATUS = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
};

// Crear nueva sesión
export const createSession = async (sessionData) => {
  try {
    const sessionRef = await addDoc(collection(db, 'sesiones'), {
      ...sessionData,
      estado: SESSION_STATUS.PENDIENTE,
      fechaCreacion: serverTimestamp(),
      comision: sessionData.precio * 0.3, // 30% de comisión
      montoTerapeuta: sessionData.precio * 0.7 // 70% para el terapeuta
    });
    
    return { success: true, sessionId: sessionRef.id };
  } catch (error) {
    console.error('Error al crear sesión:', error);
    return { success: false, error: error.message };
  }
};

// Obtener sesiones de un terapeuta
export const getTerapeutaSessions = async (terapeutaId) => {
  try {
    const q = query(
      collection(db, 'sesiones'),
      where('terapeutaId', '==', terapeutaId),
      orderBy('fecha', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, sessions };
  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    return { success: false, error: error.message };
  }
};

// Obtener sesiones de un paciente
export const getPacienteSessions = async (pacienteId) => {
  try {
    const q = query(
      collection(db, 'sesiones'),
      where('pacienteId', '==', pacienteId),
      orderBy('fecha', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, sessions };
  } catch (error) {
    console.error('Error al obtener sesiones del paciente:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar estado de sesión
export const updateSessionStatus = async (sessionId, newStatus) => {
  try {
    await updateDoc(doc(db, 'sesiones', sessionId), {
      estado: newStatus,
      fechaActualizacion: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar estado de sesión:', error);
    return { success: false, error: error.message };
  }
};

// Obtener sesión específica
export const getSession = async (sessionId) => {
  try {
    const sessionDoc = await getDoc(doc(db, 'sesiones', sessionId));
    
    if (sessionDoc.exists()) {
      return { success: true, session: { id: sessionDoc.id, ...sessionDoc.data() } };
    } else {
      return { success: false, error: 'Sesión no encontrada' };
    }
  } catch (error) {
    console.error('Error al obtener sesión:', error);
    return { success: false, error: error.message };
  }
};

// Crear nota de sesión
export const createSessionNote = async (noteData) => {
  try {
    const noteRef = await addDoc(collection(db, 'notas'), {
      ...noteData,
      fechaCreacion: serverTimestamp()
    });
    
    return { success: true, noteId: noteRef.id };
  } catch (error) {
    console.error('Error al crear nota:', error);
    return { success: false, error: error.message };
  }
};

// Obtener notas de una sesión
export const getSessionNotes = async (sessionId) => {
  try {
    const q = query(
      collection(db, 'notas'),
      where('sessionId', '==', sessionId),
      orderBy('fechaCreacion', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const notes = [];
    
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, notes };
  } catch (error) {
    console.error('Error al obtener notas:', error);
    return { success: false, error: error.message };
  }
};

// Registrar pago
export const registerPayment = async (paymentData) => {
  try {
    const paymentRef = await addDoc(collection(db, 'pagos'), {
      ...paymentData,
      fechaCreacion: serverTimestamp()
    });
    
    return { success: true, paymentId: paymentRef.id };
  } catch (error) {
    console.error('Error al registrar pago:', error);
    return { success: false, error: error.message };
  }
}; 