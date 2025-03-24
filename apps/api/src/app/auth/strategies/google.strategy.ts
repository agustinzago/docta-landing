import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import type { ConfigType } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../users/user.service';
import configuration from '../../config/configuration';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>,
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {
    const clientID = config.google.clientId;
    const clientSecret = config.google.clientSecret;
    const callbackURL = config.google.redirectUrl;

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing Google OAuth configuration');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    try {
      const { id, emails, name, photos } = profile;

      // Verificar que tengamos un email
      if (!emails || emails.length === 0) {
        return done(new Error('No email provided from Google'), null);
      }

      const email = emails[0].value;
      const firstName = name?.givenName || '';
      const lastName = name?.familyName || '';
      const photo = photos && photos.length > 0 ? photos[0].value : null;

      // Implementa reintentos para problemas de conexión
      let user;
      try {
        // Buscar usuario por googleId o email
        user = await this.userService.findByGoogleId(id);
      } catch (error: any) {
        if (error.code === 'P2024') {
          // Error de tiempo de espera del pool de conexiones
          console.error('Database connection pool timeout, retrying...');
          // Esperar un momento y reintentar una vez
          await new Promise((resolve) => setTimeout(resolve, 1000));
          user = await this.userService.findByGoogleId(id);
        } else {
          throw error;
        }
      }

      if (!user) {
        try {
          // Intentar encontrar por email
          user = await this.userService.findByEmail(email);
        } catch (error: any) {
          if (error.code === 'P2024') {
            // Error de tiempo de espera del pool de conexiones
            console.error(
              'Database connection pool timeout on email lookup, retrying...'
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            user = await this.userService.findByEmail(email);
          } else {
            throw error;
          }
        }
      }

      if (!user) {
        try {
          // Crear un nuevo usuario
          const newUser = await this.prisma.user.create({
            data: {
              email: email,
              name: `${firstName} ${lastName}`.trim(),
              profileImage: photo,
              googleId: id,
              googleEmail: email,
              refreshToken: refreshToken,
              tier: 'Free',
              credits: '10',
            },
          });

          return done(null, new User(newUser));
        } catch (error: any) {
          if (error.code === 'P2024') {
            console.error(
              'Database connection pool timeout on user creation, retrying...'
            );
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const newUser = await this.prisma.user.create({
              data: {
                email: email,
                name: `${firstName} ${lastName}`.trim(),
                profileImage: photo,
                googleId: id,
                googleEmail: email,
                refreshToken: refreshToken,
                tier: 'Free',
                credits: '10',
              },
            });
            return done(null, new User(newUser));
          } else {
            throw error;
          }
        }
      } else {
        try {
          // Actualizar información de Google si el usuario ya existe
          const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
              googleId: id,
              googleEmail: email,
              refreshToken: refreshToken,
              // Solo actualizar la imagen si no tiene una
              profileImage: user.profileImage || photo,
            },
          });

          return done(null, new User(updatedUser));
        } catch (error: any) {
          if (error.code === 'P2024') {
            console.error(
              'Database connection pool timeout on user update, retrying...'
            );
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const updatedUser = await this.prisma.user.update({
              where: { id: user.id },
              data: {
                googleId: id,
                googleEmail: email,
                refreshToken: refreshToken,
                profileImage: user.profileImage || photo,
              },
            });
            return done(null, new User(updatedUser));
          } else {
            throw error;
          }
        }
      }
    } catch (error: any) {
      console.error('Error en validación de Google OAuth:', error);
      return done(error, null);
    }
  }
}
