'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Puedes reemplazar esto con tu API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para enviar/recibir cookies
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse');
      }

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Redirigir a la ruta de autenticación con Google
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="flex justify-center">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="h-20 w-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear una cuenta en Docta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <Link href="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
              inicia sesión si ya tienes cuenta
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">O continúa con</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignUp}
              className="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="flex items-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M12.545 12.151L12.545 12.151L12.545 12.151V12.151ZM10.495 14.201H14.235C13.985 15.301 13.045 16.001 12.045 16.001C10.945 16.001 9.945 15.201 9.645 14.201C9.545 13.701 9.545 13.251 9.645 12.801H7.545C7.445 13.201 7.445 13.651 7.445 14.001C7.545 16.501 9.545 18.501 12.045 18.501C14.045 18.501 15.795 17.101 16.445 15.201C16.645 14.701 16.745 14.101 16.745 13.501C16.745 13.401 16.745 13.301 16.745 13.151H12.045C11.395 13.151 10.895 13.651 10.895 14.301C10.895 13.651 10.495 14.201 10.495 14.201Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M7.54502 11.3509H9.64502C9.94502 10.3509 10.945 9.55092 12.045 9.55092C13.045 9.55092 13.945 10.2509 14.235 11.3509H16.345C15.995 9.05092 14.245 7.05092 12.045 7.05092C9.54502 7.05092 7.54502 9.05092 7.44502 11.6509V12.0509C7.44502 11.8509 7.54502 11.3509 7.54502 11.3509Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0451 7.05084C13.1451 7.05084 14.2451 7.45084 14.9451 8.35084L16.7451 6.55084C15.4451 5.35084 13.7451 4.55084 12.0451 4.55084C8.54505 4.55084 5.54505 7.05084 5.04505 10.4508C4.94505 10.9508 4.94505 11.5508 4.94505 12.0508C5.04505 12.5508 5.04505 13.0508 5.14505 13.5508C5.64505 17.0508 8.54505 19.5508 12.0451 19.5508C13.7451 19.5508 15.3451 18.9508 16.5451 17.8508C17.8451 16.7508 18.6451 15.1508 18.7451 13.4508V13.1508H18.6451C18.6451 13.2508 18.6451 13.3508 18.6451 13.4508C18.5451 13.9508 18.4451 14.6508 18.2451 15.0508C17.6451 17.0508 15.8451 18.4508 13.7451 18.4508C11.2451 18.4508 9.14505 16.4508 9.04505 13.9508C9.04505 13.6508 9.04505 13.3508 9.04505 13.0508C9.04505 12.7508 9.04505 12.4508 9.14505 12.1508C9.24505 12.0508 9.24505 12.0508 9.24505 12.0508C9.54505 10.2508 10.7451 8.95084 12.0451 8.95084C13.0451 8.95084 13.9451 9.65084 14.2451 10.7508H16.3451C15.9451 8.65084 14.1451 7.05084 12.0451 7.05084Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.045 16.001C13.045 16.001 13.985 15.301 14.235 14.201H10.495C10.495 14.201 10.895 13.651 10.895 14.301C10.895 13.651 11.395 13.151 12.045 13.151H16.745C16.745 13.301 16.745 13.401 16.745 13.501C16.745 14.101 16.645 14.701 16.445 15.201C15.795 17.101 14.045 18.501 12.045 18.501C9.545 18.501 7.545 16.501 7.445 14.001C7.445 13.651 7.445 13.201 7.545 12.801H9.645C9.545 13.251 9.545 13.701 9.645 14.201C9.945 15.201 10.945 16.001 12.045 16.001Z"
                    fill="#34A853"
                  />
                </svg>
                Continuar con Google
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
