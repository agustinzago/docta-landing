'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/lib/authService';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Solo verificar si no estamos ya cargando
    if (!isLoading) {
      const verifyAuth = async () => {
        try {
          // Si no hay usuario, intentar refrescar una vez más
          if (!user) {
            console.log('No hay usuario autenticado, intentando refrescar token...');
            const refreshed = await authService.refreshToken();
            
            if (!refreshed) {
              console.log('No se pudo refrescar el token, redirigiendo a login');
              router.push('/sign-in');
              return;
            }
            
            // Comprobar si podemos obtener el perfil después del refresco
            try {
              await authService.getProfile();
              console.log('Perfil obtenido después de refrescar, manteniendo en la página');
            } catch (profileError) {
              console.error('No se pudo obtener el perfil después de refrescar', profileError);
              router.push('/sign-in');
              return;
            }
          }
        } finally {
          setIsVerifying(false);
        }
      };
      
      verifyAuth();
    }
  }, [user, isLoading, router]);

  if (isLoading || isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}