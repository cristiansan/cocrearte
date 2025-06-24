import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCurrentUser, onAuthStateChange, logoutUser, getTherapistData } from '../services/authService';
import { getPatientsByTherapist, addPatient } from '../services/patientService';
import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [therapist, setTherapist] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Form state for new patient
  const [newPatient, setNewPatient] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    genero: '',
    motivoConsulta: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setUser(user);
        loadTherapistData(user.uid);
        loadPatients(user.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadTherapistData = async (uid) => {
    const result = await getTherapistData(uid);
    if (result.success) {
      setTherapist(result.data);
    }
  };

  const loadPatients = async (therapistId) => {
    const result = await getPatientsByTherapist(therapistId);
    if (result.success) {
      setPatients(result.patients);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    
    if (!newPatient.nombre || !newPatient.apellido) {
      setMessage('Nombre y apellido son obligatorios');
      return;
    }

    const result = await addPatient(user.uid, newPatient);
    if (result.success) {
      setMessage('Paciente agregado exitosamente');
      setShowAddPatient(false);
      setNewPatient({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        genero: '',
        motivoConsulta: ''
      });
      loadPatients(user.uid);
    } else {
      setMessage('Error: ' + result.error);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  const openPatientRecord = (patientId) => {
    router.push(`/patient/${patientId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Cocrearte</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-darkbg">
        {/* Header */}
        <header className="bg-white shadow-sm dark:bg-darkcard dark:border-b dark:border-darkborder">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary-600 dark:text-accent-400">🧠 Cocrearte</h1>
                <span className="ml-4 text-gray-600 dark:text-darkmuted">Dashboard Terapeuta</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 dark:text-darktext">
                  Bienvenido, {therapist?.nombre || user?.email}
                </span>
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="btn-secondary dark:bg-darkcard dark:text-darktext dark:border-darkborder"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Message */}
        {message && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded dark:bg-teal-600 dark:border-teal-500 dark:text-darktext">
              {message}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 dark:bg-darkcard dark:text-darktext dark:border dark:border-darkborder">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-teal-500 dark:text-darktext">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-darkmuted">Total Pacientes</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-darktext">{patients.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 dark:bg-darkcard dark:text-darktext dark:border dark:border-darkborder">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-teal-400 dark:text-darktext">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-darkmuted">Sesiones Hoy</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-darktext">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 dark:bg-darkcard dark:text-darktext dark:border dark:border-darkborder">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-accent-500 dark:text-darktext">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-darkmuted">Próximas Sesiones</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-darktext">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Patients Section */}
          <div className="bg-white rounded-lg shadow dark:bg-darkcard dark:text-darktext dark:border dark:border-darkborder">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-darkborder">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-darktext">Mis Pacientes</h2>
                <button
                  onClick={() => setShowAddPatient(true)}
                  className="btn-primary dark:bg-accent-500 dark:text-white dark:hover:bg-accent-600"
                >
                  + Agregar Paciente
                </button>
              </div>
            </div>

            <div className="p-6">
              {patients.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4 dark:text-darkmuted">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-darktext">No hay pacientes registrados</h3>
                  <p className="text-gray-600 mb-4 dark:text-darkmuted">Comienza agregando tu primer paciente</p>
                  <button
                    onClick={() => setShowAddPatient(true)}
                    className="btn-primary dark:bg-accent-500 dark:text-white dark:hover:bg-accent-600"
                  >
                    Agregar Primer Paciente
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => openPatientRecord(patient.id)}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors dark:bg-darkbg dark:text-darktext dark:hover:bg-darkborder"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold dark:bg-accent-400 dark:text-darkbg">
                          {patient.nombre.charAt(0)}{patient.apellido.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900 dark:text-darktext">
                            {patient.nombre} {patient.apellido}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-darkmuted">
                            {patient.telefono || 'Sin teléfono'}
                          </p>
                        </div>
                      </div>
                      {patient.motivoConsulta && (
                        <p className="text-sm text-gray-600 truncate dark:text-darkmuted">
                          {patient.motivoConsulta}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Add Patient Modal */}
        {showAddPatient && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 dark:bg-darkbg dark:bg-opacity-80">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-darkcard dark:text-darktext dark:border-darkborder">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-darktext">Agregar Nuevo Paciente</h3>
                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-darkmuted">Nombre *</label>
                      <input
                        type="text"
                        value={newPatient.nombre}
                        onChange={(e) => setNewPatient({...newPatient, nombre: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-darkmuted">Apellido *</label>
                      <input
                        type="text"
                        value={newPatient.apellido}
                        onChange={(e) => setNewPatient({...newPatient, apellido: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-darkmuted">Email</label>
                    <input
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-darkmuted">Teléfono</label>
                    <input
                      type="tel"
                      value={newPatient.telefono}
                      onChange={(e) => setNewPatient({...newPatient, telefono: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-darkmuted">Motivo de Consulta</label>
                    <textarea
                      value={newPatient.motivoConsulta}
                      onChange={(e) => setNewPatient({...newPatient, motivoConsulta: e.target.value})}
                      className="input-field"
                      rows="3"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddPatient(false)}
                      className="btn-secondary dark:bg-darkcard dark:text-darktext dark:border-darkborder"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary dark:bg-accent-500 dark:text-white dark:hover:bg-accent-600"
                    >
                      Agregar Paciente
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 