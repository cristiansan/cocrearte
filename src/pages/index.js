import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCurrentUser, onAuthStateChange } from '../services/authService';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      
      // Si el usuario está autenticado, redirigir al dashboard
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando Cocrearte...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Cocrearte - Gestión de Terapeutas</title>
        <meta name="description" content="Plataforma web para gestión de psicólogos y terapeutas en Espacio Cocrearte" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:bg-darkbg">
        {/* Header */}
        <header className="bg-white shadow-sm relative dark:bg-darkcard dark:border-b dark:border-darkborder">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-2xl font-bold text-primary-600 dark:text-accent-400">🧠 Cocrearte</h1>
                  <ThemeToggle />
                </div>
              </div>
              <div className="flex space-x-4">
                <a href="/login" className="btn-primary dark:bg-accent-500 dark:text-white dark:hover:bg-accent-600">
                  Iniciar Sesión
                </a>
                <a href="/register" className="btn-secondary dark:bg-darkcard dark:text-darktext dark:border-darkborder">
                  Registrarse
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl dark:text-darktext">
              Gestión Integral para
              <span className="text-primary-600 dark:text-accent-400"> Terapeutas</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto dark:text-darkmuted">
              Plataforma web diseñada exclusivamente para psicólogos y terapeutas. 
              Gestiona pacientes, mantén fichas clínicas completas y administra sesiones de manera eficiente.
            </p>
            
            <div className="mt-10 flex justify-center space-x-4">
              <a href="/register" className="btn-primary text-lg px-8 py-3 dark:bg-accent-500 dark:text-white dark:hover:bg-accent-600">
                Registrarse como Terapeuta
              </a>
              <a href="/login" className="btn-secondary text-lg px-8 py-3 dark:bg-darkcard dark:text-darktext dark:border-darkborder">
                Ya tengo cuenta
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card text-center bg-white dark:bg-darkcard dark:text-darktext dark:border dark:border-darkborder">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="card-title">Gestión de Pacientes</h3>
              <p className="text-gray-600 dark:text-darkmuted">
                Lleva fichas completas de tus pacientes con datos personales, antecedentes y motivo de consulta.
              </p>
            </div>

            <div className="card text-center bg-white dark:bg-darkcard dark:text-darktext dark:border dark:border-darkborder">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="card-title">Fichas Clínicas</h3>
              <p className="text-gray-600 dark:text-darkmuted">
                Registra sesiones detalladas con observaciones, diagnósticos, tratamientos y tareas.
              </p>
            </div>

            <div className="card text-center bg-white dark:bg-darkcard dark:text-darktext dark:border dark:border-darkborder">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="card-title">Privacidad Garantizada</h3>
              <p className="text-gray-600 dark:text-darkmuted">
                Tus datos y los de tus pacientes están protegidos con la máxima seguridad.
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 dark:text-darktext">
              ¿Cómo funciona?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-4 dark:bg-accent-400 dark:text-darkbg">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-darktext">Regístrate</h3>
                <p className="text-gray-600 dark:text-darkmuted">
                  Crea tu cuenta como terapeuta con tu información profesional
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-4 dark:bg-accent-400 dark:text-darkbg">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-darktext">Agrega Pacientes</h3>
                <p className="text-gray-600 dark:text-darkmuted">
                  Registra a tus pacientes con sus datos personales y motivo de consulta
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-4 dark:bg-accent-400 dark:text-darkbg">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-darktext">Gestiona Sesiones</h3>
                <p className="text-gray-600 dark:text-darkmuted">
                  Lleva un registro detallado de cada sesión con observaciones y seguimiento
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-20 dark:bg-darkcard dark:border-darkborder">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600 dark:text-darkmuted">
              <p>&copy; 2024 Espacio Cocrearte. Plataforma exclusiva para terapeutas.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 