'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockIcon } from 'lucide-react';
import { BiEnvelopeOpen } from 'react-icons/bi';
import { FormContainer } from '@/components/Auth/FormContainer';
import { FormHeading } from '@/components/Auth/FormHeading';
import { ErrorMessage } from '@/components/Auth/ErrorMessage';
import { SocialButton } from '@/components/Auth/SocialButton';
import { InputField } from '@/components/Auth/InputField';
import { SubmitButton } from '@/components/Auth/SubmitButton';
import { AuthLink } from '@/components/Auth/Link';
import { Divider } from '@/components/Auth/Divider';
import { useAuth } from '@/contexts/AuthContext';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  const { login, googleLogin, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Redirecciona si ya está autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, callbackUrl, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    try {
      await login(email, password);
      router.push(callbackUrl);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    googleLogin();
  };

  return (
    <FormContainer>
      <FormHeading 
        title="Bienvenido de nuevo" 
        subtitle="Ingresa a tu cuenta para continuar" 
      />
      
      <ErrorMessage message={formError} />
      
      <div className="px-6 pb-6">
        <SocialButton onClick={handleGoogleSignIn}>
          Continuar con Google
        </SocialButton>
        
        <Divider text="o con email" />
        
        <form className="space-y-4" onSubmit={handleSignIn}>
          <InputField
            id="email"
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<BiEnvelopeOpen className="h-4 w-4 text-gray-400" />}
            placeholder="tu@email.com"
            autoComplete="email"
          />
          
          <InputField
            id="password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<LockIcon className="h-4 w-4 text-gray-400" />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3 w-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-1 block text-xs text-gray-700">
                Recordarme
              </label>
            </div>

            <div className="text-xs">
              <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
          
          <SubmitButton isLoading={isLoading} loadingText="Iniciando sesión...">
            Iniciar sesión
          </SubmitButton>
        </form>
        
        <AuthLink 
          question="¿No tienes cuenta?" 
          linkText="Regístrate" 
          href="/sign-up" 
        />
      </div>
    </FormContainer>
  );
}
