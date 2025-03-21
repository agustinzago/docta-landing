import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

interface User {
  id: number;
  email: string;
  name: string;
  profileImage?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUserFromCookies() {
      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          credentials: 'include', // Importante para enviar las cookies
        });

        if (!response.ok) {
          throw new Error('No autenticado');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setUser(null);
        setError(err instanceof Error ? err.message : 'Error de autenticación');
      } finally {
        setLoading(false);
      }
    }

    loadUserFromCookies();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrarse');
      }

      const data = await response.json();
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      setUser(null);
      // Redireccionar al login
      router.push('/sign-in');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return { user, loading, error, login, register, logout };
}
