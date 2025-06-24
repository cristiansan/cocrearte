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
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <header className="w-full max-w-xl mx-auto py-8">
          <h1 className="text-4xl font-extrabold text-primary-600 mb-2 text-center">Cocrearte</h1>
          <p className="text-lg text-gray-700 mb-6 text-center">Plataforma para terapeutas: gestiona pacientes y registros clínicos con facilidad.</p>
          <div className="flex justify-center gap-4">
            <a href="/login" className="btn-primary">Iniciar sesión</a>
            <a href="/register" className="btn-secondary">Registrarse</a>
          </div>
        </header>
        <main className="w-full max-w-xl mx-auto mt-10">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-primary-600 mb-2 text-center">¿Por qué Cocrearte?</h2>
            <p className="text-gray-700 text-center">Organiza la información de tus pacientes, lleva registros clínicos y accede a tus datos de manera segura y sencilla.</p>
          </div>
        </main>
      </div>
    </>
  );
} 