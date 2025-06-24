import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { loginUser, onAuthStateChange } from '../services/authService';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await loginUser(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setMessage('Error: ' + result.error);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Iniciar Sesión - Cocrearte</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center py-12 dark:bg-darkbg">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center flex flex-col items-center justify-center">
            <div className="flex items-center justify-center w-full mb-2">
              <h1 className="text-3xl font-bold text-primary-600 dark:text-accent-400">🧠 Cocrearte</h1>
              <ThemeToggle />
            </div>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-darktext">Iniciar Sesión</h2>
            <p className="mt-2 text-gray-600 dark:text-darkmuted">Accede a tu panel de terapeuta</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow p-8 dark:bg-darkcard dark:text-darktext dark:border dark:border-darkborder">
            {message && (
              <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700 dark:bg-accent-500 dark:border-accent-700 dark:text-darktext">
                {message}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-darkmuted">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field mt-1"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-darkmuted">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-darkmuted">
                ¿No tienes cuenta?{' '}
                <a href="/register" className="text-primary-600 hover:text-primary-500 dark:text-accent-400 dark:hover:text-accent-300">
                  Registrarse como terapeuta
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-darkmuted dark:hover:text-darktext">
              ← Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </>
  );
} 