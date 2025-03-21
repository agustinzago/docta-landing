import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import type { ConfigType } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import configuration from '../../config/configuration';

export type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private prisma: PrismaService,
    @Inject(configuration.KEY)
    private readonly config: ConfigType<typeof configuration>
  ) {
    const extractJwtFromCookie = (req: Request) => {
      // Extraer token de cookie o header de autorización
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['token'];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    const jwtSecret = config.jwt.secret;
    if (!jwtSecret) {
      throw new Error('JWT secret is not defined');
    }

    super({
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    // Validar el token y recuperar el usuario asociado
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        connections: true,
        LocalGoogleCredential: true,
        DiscordWebhook: true,
        Notion: true,
        Slack: true,
        workflows: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'El usuario no existe o el token no es válido'
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
