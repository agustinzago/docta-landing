import { User } from '@/types';

// API URL desde las variables de entorno o fallback a localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para enviar/recibir cookies
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error signing in');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  }

  async register(userData: RegisterUserData): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para recibir cookies
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error registering user');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Register service error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include', // Para enviar cookies
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error logging out');
      }
    } catch (error) {
      console.error('Logout service error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      console.log('Obteniendo perfil de usuario...');

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        credentials: 'include', // CRUCIAL: Envía las cookies con la solicitud
        headers: {
          Accept: 'application/json',
        },
      });

      console.log('Respuesta de perfil:', response.status);

      if (response.status === 401) {
        console.log('Token expirado, intentando refrescar...');
        const refreshSuccess = await this.refreshToken();

        if (refreshSuccess) {
          console.log('Token refrescado, reintentando obtener perfil');
          const retryResponse = await fetch(`${API_URL}/auth/profile`, {
            method: 'GET',
            credentials: 'include', // Importante repetir aquí también
            headers: {
              Accept: 'application/json',
            },
          });

          if (retryResponse.ok) {
            const userData = await retryResponse.json();
            console.log('Perfil obtenido tras refrescar token');
            return userData;
          }
        }

        throw new Error('No se pudo autenticar');
      }

      if (!response.ok) {
        throw new Error(`Error al obtener perfil: ${response.status}`);
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error en getProfile:', error);
      throw error;
    }
  }

  async googleLogin(): Promise<void> {
    console.log('Iniciando autenticación con Google');

    // Guardar la ruta actual para redirección después de la autenticación
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      localStorage.setItem(
        'auth_redirect',
        currentPath !== '/sign-in' ? currentPath : '/dashboard'
      );
    }

    // Obtener la URL de API
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

    // Construir la URL para la autenticación con Google
    // Sin añadir parámetros state que no están configurados en el backend
    const googleAuthUrl = `${API_URL}/auth/google`;

    console.log('Redirigiendo a:', googleAuthUrl);
    window.location.href = googleAuthUrl;
  }

  async refreshToken(): Promise<boolean> {
    try {
      console.log('Intentando refrescar token...');

      // Verificar si la cookie refresh_token existe en el navegador
      if (typeof document !== 'undefined') {
        const hasCookie = document.cookie
          .split(';')
          .some((item) => item.trim().startsWith('refresh_token='));
        console.log('Cookie refresh_token presente:', hasCookie);
      }

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // CRUCIAL: Envía las cookies almacenadas con la solicitud
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        console.log('Token refrescado con éxito');
        return true;
      } else {
        console.error('Error al refrescar token:', response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error('Detalles del error:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Excepción al refrescar token:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
