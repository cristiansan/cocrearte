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

      <div className="flex flex-col items-center justify-center min-h-screen">
        <header className="w-full flex flex-col items-center py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-2">Iniciar sesión</h1>
          <p className="text-primary-900 mb-6">Accede a tu cuenta de terapeuta</p>
        </header>
        <main className="card w-full max-w-md">
          {/* Login Form */}
          <div className="bg-white rounded-lg shadow p-8 dark:bg-darkcard dark:text-darktext dark:border dark:border-darkborder">
            {message && (
              <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700 dark:bg-accent-500 dark:border-accent-700 dark:text-darktext">
                {message}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" className="input-field w-full" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" className="input-field w-full" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="submit" className="btn-primary w-full">Entrar</button>
            </form>

            <div className="mt-4 text-center">
              <a href="/register" className="btn-accent w-full block">¿No tienes cuenta? Regístrate</a>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-darkmuted dark:hover:text-darktext">
              ← Volver al inicio
            </a>
          </div>
        </main>
      </div>
    </>
  );
} 