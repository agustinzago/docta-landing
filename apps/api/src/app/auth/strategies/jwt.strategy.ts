import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import * as config from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import configuration from '../../config/configuration';

export type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private prisma: PrismaService,
    @Inject(configuration.KEY)
    private readonly config: config.ConfigType<typeof configuration>
  ) {
    const extractJwtFromCookie = (req: Request) => {
      // Primero buscamos el token en la cookie access_token
      if (req && req.cookies) {
        const token = req.cookies['access_token'];
        if (token) {
          return token;
        }
      }

      // Si no hay token en la cookie, buscamos en el encabezado de autorización
      return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    const jwtSecret = config.jwt.secret;
    if (!jwtSecret) {
      throw new Error('JWT secret is not defined');
    }

    super({
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      jwtFromRequest: extractJwtFromCookie,
      passReqToCallback: false, // No necesitamos pasar la req al método validate
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    // Validar que el payload contenga la información necesaria
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token structure');
    }

    // Buscar usuario en la base de datos
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        tier: true,
        credits: true,
        // Solo incluimos las relaciones si son necesarias para la autenticación
        connections: false, // Cambia a true si necesitas estas relaciones
        LocalGoogleCredential: false,
        DiscordWebhook: false,
        Notion: false,
        Slack: false,
        workflows: false,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'User does not exist or token is invalid'
      );
    }

    // Convertir los campos null a undefined para evitar problemas con los tipos
    const userWithoutNulls = this.convertNullToUndefined(user);

    // Devolver el usuario como objeto de dominio
    return new User(userWithoutNulls);
  }

  // Método para convertir valores null a undefined para cumplir con el tipo User
  private convertNullToUndefined(obj: any): Partial<User> {
    const result: any = {};
    for (const key in obj) {
      result[key] = obj[key] === null ? undefined : obj[key];
    }
    return result;
  }
}
