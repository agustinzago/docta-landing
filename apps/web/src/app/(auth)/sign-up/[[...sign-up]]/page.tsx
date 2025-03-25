'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LockIcon, UserIcon } from 'lucide-react';
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

export default function SignUp() {
  const router = useRouter();
  const { register, googleLogin, isAuthenticated } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirecciona si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await register(name, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
      console.error('Error de registro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    googleLogin();
  };

  return (
    <FormContainer>
      <FormHeading 
        title="Crea tu cuenta" 
        subtitle="Para comenzar a usar Docta" 
      />
      
      <ErrorMessage message={error} />
      
      <div className="px-6 pb-6">
        <SocialButton onClick={handleGoogleSignUp}>
          Continuar con Google
        </SocialButton>
        
        <Divider text="o con email" />
        
        <form className="space-y-4" onSubmit={handleSignUp}>
          <InputField
            id="name"
            label="Nombre completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<UserIcon className="h-4 w-4 text-gray-400" />}
            placeholder="Tu nombre"
            autoComplete="name"
          />
          
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
            autoComplete="new-password"
            helpText="Mínimo 8 caracteres"
          />
          
          <SubmitButton isLoading={isLoading} loadingText="Creando cuenta...">
            Crear cuenta
          </SubmitButton>
        </form>
        
        <AuthLink 
          question="¿Ya tienes cuenta?" 
          linkText="Iniciar sesión" 
          href="/sign-in" 
        />
      </div>
    </FormContainer>
  );
}
