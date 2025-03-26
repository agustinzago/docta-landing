import { Injectable, Inject, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import type { ConfigType } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../users/user.service';
import configuration from '../../config/configuration';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

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

      if (!emails || emails.length === 0) {
        return done(new Error('No email provided from Google'), null);
      }

      const email = emails[0].value;
      const firstName = name?.givenName || '';
      const lastName = name?.familyName || '';
      const photo = photos && photos.length > 0 ? photos[0].value : null;

      // Buscar o crear usuario con manejo de reintentos
      const user = await this.findOrCreateUser(
        id,
        email,
        firstName,
        lastName,
        photo,
        refreshToken
      );

      return done(null, new User(user));
    } catch (error) {
      const errorObj = error as Error;
      this.logger.error(
        `Error during Google OAuth validation: ${errorObj.message}`,
        errorObj.stack
      );
      return done(error, null);
    }
  }

  private async findOrCreateUser(
    googleId: string,
    email: string,
    firstName: string,
    lastName: string,
    photo: string | null,
    refreshToken: string
  ) {
    // Intenta ejecutar una función con retries para manejar errores de conexión
    const executeWithRetry = async <T>(
      fn: () => Promise<T>,
      retries = 1
    ): Promise<T> => {
      try {
        return await fn();
      } catch (error: unknown) {
        const prismaError = error as { code?: string };
        if (prismaError.code === 'P2024' && retries > 0) {
          this.logger.warn(
            `Database connection pool timeout, retrying... (${retries} retries left)`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return executeWithRetry(fn, retries - 1);
        }
        throw error;
      }
    };

    // Buscar por googleId
    let user = await executeWithRetry(() =>
      this.userService.findByGoogleId(googleId)
    );

    // Si no existe, buscar por email
    if (!user) {
      user = await executeWithRetry(() => this.userService.findByEmail(email));
    }

    // Si todavía no existe, crear nuevo usuario
    if (!user) {
      return executeWithRetry(() =>
        this.prisma.user.create({
          data: {
            email,
            name: `${firstName} ${lastName}`.trim(),
            profileImage: photo,
            googleId,
            googleEmail: email,
            refreshToken,
            tier: 'Free',
            credits: '10',
          },
        })
      );
    }

    // Actualizar usuario existente
    return executeWithRetry(() =>
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          googleEmail: email,
          refreshToken,
          profileImage: user.profileImage || photo,
        },
      })
    );
  }
}
