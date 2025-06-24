import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCurrentUser, onAuthStateChange } from '../../services/authService';
import { getPatientById, addClinicalSession, getPatientSessions, updatePatient } from '../../services/patientService';

export default function PatientRecord() {
  const [user, setUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddSession, setShowAddSession] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { id } = router.query;

  // Form state for new session
  const [newSession, setNewSession] = useState({
    fecha: new Date().toISOString().split('T')[0],
    duracion: 60,
    tipo: 'individual',
    motivo: '',
    observaciones: '',
    diagnostico: '',
    tratamiento: '',
    tareas: '',
    proximaSesion: ''
  });

  // Form state for editing patient
  const [editPatient, setEditPatient] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setUser(user);
        if (id) {
          loadPatientData(id);
          loadPatientSessions(id);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, id]);

  const loadPatientData = async (patientId) => {
    const result = await getPatientById(patientId);
    if (result.success) {
      setPatient(result.data);
      setEditPatient(result.data);
    } else {
      setMessage('Error: ' + result.error);
    }
  };

  const loadPatientSessions = async (patientId) => {
    const result = await getPatientSessions(patientId);
    if (result.success) {
      setSessions(result.sessions);
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    
    if (!newSession.fecha || !newSession.motivo) {
      setMessage('Fecha y motivo son obligatorios');
      return;
    }

    const result = await addClinicalSession(id, newSession);
    if (result.success) {
      setMessage('Sesión agregada exitosamente');
      setShowAddSession(false);
      setNewSession({
        fecha: new Date().toISOString().split('T')[0],
        duracion: 60,
        tipo: 'individual',
        motivo: '',
        observaciones: '',
        diagnostico: '',
        tratamiento: '',
        tareas: '',
        proximaSesion: ''
      });
      loadPatientSessions(id);
    } else {
      setMessage('Error: ' + result.error);
    }
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    
    const result = await updatePatient(id, editPatient);
    if (result.success) {
      setMessage('Datos del paciente actualizados exitosamente');
      setEditing(false);
      loadPatientData(id);
    } else {
      setMessage('Error: ' + result.error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ficha clínica...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Paciente no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Ficha Clínica - {patient.nombre} {patient.apellido}</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="mr-4 text-gray-600 hover:text-gray-900"
                >
                  ← Volver
                </button>
                <h1 className="text-2xl font-bold text-primary-600">🧠 Cocrearte</h1>
                <span className="ml-4 text-gray-600">Ficha Clínica</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddSession(true)}
                  className="btn-primary"
                >
                  + Nueva Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Message */}
        {message && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Patient Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {patient.nombre} {patient.apellido}
                  </h2>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {editing ? 'Cancelar' : 'Editar'}
                  </button>
                </div>

                {editing ? (
                  <form onSubmit={handleUpdatePatient} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                          type="text"
                          value={editPatient.nombre || ''}
                          onChange={(e) => setEditPatient({...editPatient, nombre: e.target.value})}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Apellido</label>
                        <input
                          type="text"
                          value={editPatient.apellido || ''}
                          onChange={(e) => setEditPatient({...editPatient, apellido: e.target.value})}
                          className="input-field"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={editPatient.email || ''}
                        onChange={(e) => setEditPatient({...editPatient, email: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                      <input
                        type="tel"
                        value={editPatient.telefono || ''}
                        onChange={(e) => setEditPatient({...editPatient, telefono: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        value={editPatient.fechaNacimiento || ''}
                        onChange={(e) => setEditPatient({...editPatient, fechaNacimiento: e.target.value})}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Motivo de Consulta</label>
                      <textarea
                        value={editPatient.motivoConsulta || ''}
                        onChange={(e) => setEditPatient({...editPatient, motivoConsulta: e.target.value})}
                        className="input-field"
                        rows="3"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="btn-secondary"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                      >
                        Guardar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{patient.email || 'No especificado'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                      <p className="text-gray-900">{patient.telefono || 'No especificado'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                      <p className="text-gray-900">{formatDate(patient.fechaNacimiento) || 'No especificada'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Motivo de Consulta</label>
                      <p className="text-gray-900">{patient.motivoConsulta || 'No especificado'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha de Registro</label>
                      <p className="text-gray-900">{formatDate(patient.fechaCreacion?.toDate())}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sessions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Sesiones Clínicas</h2>
                </div>

                <div className="p-6">
                  {sessions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">📋</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay sesiones registradas</h3>
                      <p className="text-gray-600 mb-4">Comienza agregando la primera sesión</p>
                      <button
                        onClick={() => setShowAddSession(true)}
                        className="btn-primary"
                      >
                        Agregar Primera Sesión
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {sessions.map((session) => (
                        <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                Sesión del {formatDate(session.fecha)}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Duración: {session.duracion} minutos | Tipo: {session.tipo}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              session.estado === 'completada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {session.estado}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <label className="font-medium text-gray-700">Motivo:</label>
                              <p className="text-gray-900">{session.motivo}</p>
                            </div>
                            <div>
                              <label className="font-medium text-gray-700">Diagnóstico:</label>
                              <p className="text-gray-900">{session.diagnostico || 'No especificado'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="font-medium text-gray-700">Observaciones:</label>
                              <p className="text-gray-900">{session.observaciones || 'No especificadas'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="font-medium text-gray-700">Tratamiento:</label>
                              <p className="text-gray-900">{session.tratamiento || 'No especificado'}</p>
                            </div>
                            {session.tareas && (
                              <div className="md:col-span-2">
                                <label className="font-medium text-gray-700">Tareas:</label>
                                <p className="text-gray-900">{session.tareas}</p>
                              </div>
                            )}
                            {session.proximaSesion && (
                              <div>
                                <label className="font-medium text-gray-700">Próxima Sesión:</label>
                                <p className="text-gray-900">{formatDate(session.proximaSesion)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Add Session Modal */}
        {showAddSession && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Sesión Clínica</h3>
                <form onSubmit={handleAddSession} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha *</label>
                      <input
                        type="date"
                        value={newSession.fecha}
                        onChange={(e) => setNewSession({...newSession, fecha: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duración (min)</label>
                      <input
                        type="number"
                        value={newSession.duracion}
                        onChange={(e) => setNewSession({...newSession, duracion: parseInt(e.target.value)})}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo</label>
                      <select
                        value={newSession.tipo}
                        onChange={(e) => setNewSession({...newSession, tipo: e.target.value})}
                        className="input-field"
                      >
                        <option value="individual">Individual</option>
                        <option value="pareja">Pareja</option>
                        <option value="familiar">Familiar</option>
                        <option value="grupal">Grupal</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Motivo *</label>
                    <input
                      type="text"
                      value={newSession.motivo}
                      onChange={(e) => setNewSession({...newSession, motivo: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                    <textarea
                      value={newSession.observaciones}
                      onChange={(e) => setNewSession({...newSession, observaciones: e.target.value})}
                      className="input-field"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Diagnóstico</label>
                    <textarea
                      value={newSession.diagnostico}
                      onChange={(e) => setNewSession({...newSession, diagnostico: e.target.value})}
                      className="input-field"
                      rows="2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                    <textarea
                      value={newSession.tratamiento}
                      onChange={(e) => setNewSession({...newSession, tratamiento: e.target.value})}
                      className="input-field"
                      rows="2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tareas</label>
                    <textarea
                      value={newSession.tareas}
                      onChange={(e) => setNewSession({...newSession, tareas: e.target.value})}
                      className="input-field"
                      rows="2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Próxima Sesión</label>
                    <input
                      type="date"
                      value={newSession.proximaSesion}
                      onChange={(e) => setNewSession({...newSession, proximaSesion: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddSession(false)}
                      className="btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Agregar Sesión
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