import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';

export type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService // Cambiado a ConfigService estándar
  ) {
    const extractJwtFromCookie = (req: Request) => {
      let token = null;

      // Primero intentar extraer de las cookies
      if (req && req.cookies) {
        token = req.cookies['access_token'];
        if (token) {
          console.log('Token extraído de cookie access_token');
          return token;
        }
      }

      // Si no hay cookie, intentar extraer del header
      const authHeader = req.headers['authorization'];
      if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
        token = authHeader.split(' ')[1];
        console.log('Token extraído de Authorization header');
        return token;
      }

      return null;
    };

    const secretKey = configService.get<string>('JWT_SECRET');
    if (!secretKey) {
      throw new Error('JWT_SECRET not configured properly');
    }

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: secretKey, // Usar ConfigService directamente
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
