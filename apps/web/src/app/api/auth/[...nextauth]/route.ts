import config from '@/lib/config';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

// Extend next-auth types
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { email, password } = credentials;
          const res = await fetch(`${config.env.apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            console.error('Authentication error:', res.statusText);
            return null;
          }

          const userData = await res.json();

          // Asegúrate de que el objeto de usuario tenga el formato esperado
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            image: userData.profileImage,
            // Puedes incluir cualquier dato adicional que necesites
          };
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Asegúrate de que el ID del usuario se incluya en el token JWT
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        // Puedes agregar cualquier información adicional al token aquí
      }
      return token;
    },
    // Incluye el ID del usuario en la sesión
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
        // Puedes agregar cualquier información adicional a la sesión aquí
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
