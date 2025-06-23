import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCurrentUser, onAuthStateChange } from '../services/authService';

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

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-primary-600">🧠 Cocrearte</h1>
                </div>
              </div>
              <div className="flex space-x-4">
                <a href="/login" className="btn-primary">
                  Iniciar Sesión
                </a>
                <a href="/register" className="btn-secondary">
                  Registrarse
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Gestión Integral para
              <span className="text-primary-600"> Terapeutas</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Plataforma web diseñada para psicólogos y terapeutas que trabajan de manera colaborativa 
              en un espacio físico común. Gestiona pacientes, agenda sesiones y administra pagos.
            </p>
            
            <div className="mt-10 flex justify-center space-x-4">
              <a href="/register" className="btn-primary text-lg px-8 py-3">
                Comenzar Ahora
              </a>
              <a href="/about" className="btn-secondary text-lg px-8 py-3">
                Conocer Más
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="card-title">Gestión de Pacientes</h3>
              <p className="text-gray-600">
                Lleva fichas completas de tus pacientes con notas personales y resúmenes de sesiones.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="card-title">Agenda Inteligente</h3>
              <p className="text-gray-600">
                Sistema de reservas automático con confirmación de pagos y recordatorios.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="card-title">Gestión de Pagos</h3>
              <p className="text-gray-600">
                Control automático de comisiones y seguimiento de transacciones.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2024 Espacio Cocrearte. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 