import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Agregar nuevo paciente
export const addPatient = async (therapistId, patientData) => {
  try {
    const patientRef = await addDoc(collection(db, 'pacientes'), {
      terapeutaId: therapistId,
      nombre: patientData.nombre,
      apellido: patientData.apellido,
      email: patientData.email || '',
      telefono: patientData.telefono || '',
      fechaNacimiento: patientData.fechaNacimiento || '',
      genero: patientData.genero || '',
      direccion: patientData.direccion || '',
      ocupacion: patientData.ocupacion || '',
      estadoCivil: patientData.estadoCivil || '',
      emergenciaContacto: patientData.emergenciaContacto || '',
      emergenciaTelefono: patientData.emergenciaTelefono || '',
      motivoConsulta: patientData.motivoConsulta || '',
      antecedentes: patientData.antecedentes || '',
      medicamentos: patientData.medicamentos || '',
      alergias: patientData.alergias || '',
      activo: true,
      fechaCreacion: serverTimestamp(),
      ...patientData
    });

    return { success: true, patientId: patientRef.id };
  } catch (error) {
    console.error('Error al agregar paciente:', error);
    return { success: false, error: error.message };
  }
};

// Obtener lista de pacientes de un terapeuta
export const getPatientsByTherapist = async (therapistId) => {
  try {
    const q = query(
      collection(db, 'pacientes'),
      where('terapeutaId', '==', therapistId),
      where('activo', '==', true),
      orderBy('fechaCreacion', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const patients = [];
    
    querySnapshot.forEach((doc) => {
      patients.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, patients };
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return { success: false, error: error.message };
  }
};

// Obtener datos de un paciente específico
export const getPatientById = async (patientId) => {
  try {
    const patientDoc = await getDoc(doc(db, 'pacientes', patientId));
    if (patientDoc.exists()) {
      return { success: true, data: { id: patientDoc.id, ...patientDoc.data() } };
    } else {
      return { success: false, error: 'Paciente no encontrado' };
    }
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar datos de un paciente
export const updatePatient = async (patientId, patientData) => {
  try {
    await updateDoc(doc(db, 'pacientes', patientId), {
      ...patientData,
      fechaActualizacion: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar paciente (marcar como inactivo)
export const deletePatient = async (patientId) => {
  try {
    await updateDoc(doc(db, 'pacientes', patientId), {
      activo: false,
      fechaEliminacion: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    return { success: false, error: error.message };
  }
};

// Agregar sesión clínica
export const addClinicalSession = async (patientId, sessionData) => {
  try {
    const sessionRef = await addDoc(collection(db, 'sesiones'), {
      pacienteId: patientId,
      fecha: sessionData.fecha,
      duracion: sessionData.duracion || 60,
      tipo: sessionData.tipo || 'individual',
      motivo: sessionData.motivo || '',
      observaciones: sessionData.observaciones || '',
      diagnostico: sessionData.diagnostico || '',
      tratamiento: sessionData.tratamiento || '',
      tareas: sessionData.tareas || '',
      proximaSesion: sessionData.proximaSesion || '',
      estado: sessionData.estado || 'completada',
      fechaCreacion: serverTimestamp()
    });

    return { success: true, sessionId: sessionRef.id };
  } catch (error) {
    console.error('Error al agregar sesión:', error);
    return { success: false, error: error.message };
  }
};

// Obtener sesiones de un paciente
export const getPatientSessions = async (patientId) => {
  try {
    const q = query(
      collection(db, 'sesiones'),
      where('pacienteId', '==', patientId),
      orderBy('fecha', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, sessions };
  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    return { success: false, error: error.message };
  }
}; 