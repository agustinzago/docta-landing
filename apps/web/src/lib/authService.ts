import { User } from '@/types';

// API URL desde las variables de entorno o fallback a localhost
const API_URL = process.env.API_URL || 'http://localhost:5005/api';

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
        credentials: 'include', // Importante para recibir cookies del backend
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error en servicio de login:', error);
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
        throw new Error(error.message || 'Error al registrarse');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error en servicio de registro:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error en servicio de logout:', error);
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        credentials: 'include', // Para enviar las cookies de autenticación
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autenticado');
        }
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  }

  async googleLogin(): Promise<void> {
    // Redirigir al usuario a la URL de inicio de sesión de Google en el backend
    window.location.href = `${API_URL}/auth/google`;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      return response.ok;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
