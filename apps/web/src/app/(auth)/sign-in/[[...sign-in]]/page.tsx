'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { LockIcon } from 'lucide-react';
import { BiEnvelopeOpen } from 'react-icons/bi';
import { FormContainer } from '@/components/Auth/FormContainer';
import { FormHeading } from '@/components/Auth/FormHeading';
import { ErrorMessage } from '@/components/Auth/ErrorMessage';
import { SocialButton } from '@/components/Auth/SocialButton';
import { Divider } from '@/components/Auth/divider';
import { InputField } from '@/components/Auth/InputField';
import { SubmitButton } from '@/components/Auth/SubmitButton';
import { AuthLink } from '@/components/Auth/Link';

// Componentes reutilizables


export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setFormError(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setFormError('Error al conectar con el servidor de autenticación');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  const errorMessage = formError || (error ? 
    error === 'CredentialsSignin' ? 'Credenciales inválidas' : 
    'Error en la autenticación'
  : '');

  return (
    <FormContainer>
      <FormHeading 
        title="Bienvenido de nuevo" 
        subtitle="Ingresa a tu cuenta para continuar" 
      />
      
      <ErrorMessage message={errorMessage} />
      
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
