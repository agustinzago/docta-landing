'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/authService';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Modificar la función fetchUserProfile

  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile');
      
      // Verificar si hay tokens en el hash de la URL (específico para OAuth)
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const userId = params.get('user_id');
        
        if (accessToken && refreshToken && userId) {
          console.log('Tokens encontrados en URL hash, estableciendo cookies...');
          
          // Establecer cookies manualmente desde el cliente
          document.cookie = `access_token=${accessToken}; path=/; max-age=${15 * 60}`;
          document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
          document.cookie = `user_id=${userId}; path=/; max-age=${7 * 24 * 60 * 60}`;
          
          // Limpiar el hash de la URL para seguridad
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
      
      // Continuar con la obtención del perfil
      const userData = await authService.getProfile();
      console.log('User profile fetched successfully', userData);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      
      // Intentar refrescar el token si hay algún usuario en la cookie
      if (document.cookie.includes('user_id')) {
        console.log('Found user_id cookie, attempting to refresh token');
        const refreshed = await authService.refreshToken();
        if (refreshed) {
          console.log('Token refreshed, trying to fetch profile again');
          try {
            const userData = await authService.getProfile();
            console.log('User profile fetched after token refresh', userData);
            setUser(userData);
            return userData;
          } catch (retryError) {
            console.error('Failed to fetch profile after token refresh:', retryError);
          }
        }
      }
      
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.login({ email, password });
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.register({ name, email, password });
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push('/sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    await authService.googleLogin();
  };

  const refreshUser = async () => {
    return await fetchUserProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        googleLogin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};