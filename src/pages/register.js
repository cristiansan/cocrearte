import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { registerTherapist, onAuthStateChange } from '../services/authService';
import ThemeToggle from '../components/ThemeToggle';

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

      <div className="flex flex-col items-center justify-center min-h-screen">
        <header className="w-full flex flex-col items-center py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-2">Registro de Terapeuta</h1>
          <p className="text-primary-900 mb-6">Crea tu cuenta para comenzar a gestionar pacientes</p>
        </header>
        <main className="card w-full max-w-md">
          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow p-8 dark:bg-darkcard dark:text-darktext dark:border dark:border-darkborder">
            {message && (
              <div className={`mb-4 p-3 rounded border ${
                message.includes('Error') 
                  ? 'bg-red-100 border-red-400 text-red-700 dark:bg-accent-500 dark:border-accent-700 dark:text-darktext'
                  : 'bg-green-100 border-green-400 text-green-700 dark:bg-teal-600 dark:border-teal-500 dark:text-darktext'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-darkmuted">
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-darkmuted">
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
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-darkmuted">
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
                <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 dark:text-darkmuted">
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-darkmuted">
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
                <p className="mt-1 text-sm text-gray-500 dark:text-darkmuted">Mínimo 6 caracteres</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-darkmuted">
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
                className="w-full btn-primary disabled:opacity-50 dark:bg-accent-500 dark:text-white dark:hover:bg-accent-600"
              >
                {loading ? 'Registrando...' : 'Registrarse como Terapeuta'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-darkmuted">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="text-primary-600 hover:text-primary-500 dark:text-accent-400 dark:hover:text-accent-300">
                  Iniciar sesión
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 