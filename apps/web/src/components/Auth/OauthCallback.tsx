'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function OauthCallback() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const processOauthRedirect = async () => {
      // Extraer tokens del hash de URL
      if (typeof window !== 'undefined' && window.location.hash) {
        try {
          const hash = window.location.hash.substring(1); // Eliminar el # inicial
          const params = new URLSearchParams(hash);
          
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const userId = params.get('user_id');
          
          if (accessToken && refreshToken && userId) {
            console.log('Tokens encontrados en la URL hash, estableciendo cookies...');
            
            // Establecer cookies manualmente desde el cliente
            // Nota: Estas cookies no serán httpOnly, pero son un fallback
            document.cookie = `access_token=${accessToken}; path=/; max-age=${15 * 60}`;
            document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
            document.cookie = `user_id=${userId}; path=/; max-age=${7 * 24 * 60 * 60}`;
            
            // Limpiar el hash de la URL para seguridad
            window.history.replaceState(null, '', window.location.pathname);
            
            // Actualizar el usuario en el contexto
            await refreshUser();
            
            // Redirigir al dashboard
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error procesando OAuth callback:', error);
        }
      }
    };

    processOauthRedirect();
  }, [router, refreshUser]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
        <p className="text-gray-500">Please wait while we set up your account.</p>
      </div>
    </div>
  );
}