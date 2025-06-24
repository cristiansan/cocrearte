import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { registerTherapist, onAuthStateChange } from '../services/authService';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    especialidad: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const result = await registerTherapist(formData.email, formData.password, {
      nombre: formData.nombre,
      telefono: formData.telefono,
      especialidad: formData.especialidad
    });

    if (result.success) {
      setMessage('Terapeuta registrado exitosamente. Redirigiendo al dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      setMessage('Error: ' + result.error);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Registrarse - Cocrearte</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-600">🧠 Cocrearte</h1>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Registrarse</h2>
            <p className="mt-2 text-gray-600">Únete como terapeuta</p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow p-8">
            {message && (
              <div className={`mb-4 p-3 rounded border ${
                message.includes('Error') 
                  ? 'bg-red-100 border-red-400 text-red-700'
                  : 'bg-green-100 border-green-400 text-green-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre Completo *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="input-field mt-1"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field mt-1"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>

              <div>
                <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700">
                  Especialidad
                </label>
                <select
                  id="especialidad"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  <option value="">Seleccionar especialidad</option>
                  <option value="psicologia">Psicología</option>
                  <option value="psiquiatria">Psiquiatría</option>
                  <option value="terapia_ocupacional">Terapia Ocupacional</option>
                  <option value="fonoaudiologia">Fonoaudiología</option>
                  <option value="psicopedagogia">Psicopedagogía</option>
                  <option value="terapia_familiar">Terapia Familiar</option>
                  <option value="terapia_cognitiva">Terapia Cognitiva</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field mt-1"
                  placeholder="••••••••"
                  minLength="6"
                />
                <p className="mt-1 text-sm text-gray-500">Mínimo 6 caracteres</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-field mt-1"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Registrarse como Terapeuta'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="text-primary-600 hover:text-primary-500">
                  Iniciar sesión
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </>
  );
} 