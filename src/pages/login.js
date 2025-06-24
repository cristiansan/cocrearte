import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { loginUser, onAuthStateChange } from '../services/authService';

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

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-600">🧠 Cocrearte</h1>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
            <p className="mt-2 text-gray-600">Accede a tu panel de terapeuta</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow p-8">
            {message && (
              <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700">
                {message}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <a href="/register" className="text-primary-600 hover:text-primary-500">
                  Registrarse como terapeuta
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