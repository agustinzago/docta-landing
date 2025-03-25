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
      console.log('Iniciando fetchUserProfile');
      
      // Verificar si estamos en la página del dashboard después de autenticación OAuth
      if (typeof window !== 'undefined' && 
          window.location.pathname === '/dashboard' && 
          window.location.search.includes('auth_success=true')) {
        
        console.log('Detectada redirección OAuth exitosa');
        
        // Intentar obtener el perfil inmediatamente
        try {
          const userData = await authService.getProfile();
          console.log('Perfil obtenido correctamente después de OAuth:', userData);
          setUser(userData);
          
          // Limpiar parámetros de URL manteniendo la ruta actual
          window.history.replaceState({}, document.title, window.location.pathname);
          
          return userData;
        } catch (profileError) {
          console.error('Error obteniendo perfil después de OAuth:', profileError);
        }
      }
      
      // Flujo normal para otras páginas o si el método anterior falló
      const userData = await authService.getProfile();
      console.log('Perfil obtenido correctamente:', userData);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error en fetchUserProfile:', error);
      
      // Intentar refrescar el token si hay una cookie user_id
      if (document.cookie.includes('user_id')) {
        console.log('Detectada cookie user_id, intentando refrescar token');
        const refreshed = await authService.refreshToken();
        
        if (refreshed) {
          console.log('Token refrescado correctamente, obteniendo perfil');
          try {
            const userData = await authService.getProfile();
            console.log('Perfil obtenido después de refrescar token:', userData);
            setUser(userData);
            return userData;
          } catch (retryError) {
            console.error('Error obteniendo perfil después de refrescar token:', retryError);
          }
        } else {
          console.error('Falló el refresco del token');
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