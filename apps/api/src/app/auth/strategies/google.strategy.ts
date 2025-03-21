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

      // Buscar usuario por googleId o email
      let user = await this.userService.findByGoogleId(id);

      if (!user) {
        // Intentar encontrar por email por si ya existe pero no se autenticó con Google
        user = await this.userService.findByEmail(email);
      }

      if (!user) {
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
      } else {
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
      }
    } catch (error) {
      console.error('Error en validación de Google OAuth:', error);
      return done(error, null);
    }
  }
}
