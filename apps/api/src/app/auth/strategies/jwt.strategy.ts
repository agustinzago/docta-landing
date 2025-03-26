import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
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
  private readonly logger = new Logger(JwtStrategy.name);
  private readonly ACCESS_TOKEN_COOKIE_NAME = 'access_token';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    const secretKey = configService.get<string>('JWT_SECRET');
    if (!secretKey) {
      throw new Error('JWT_SECRET not configured properly');
    }

    // Creamos una función extractora independiente para usarla en super()
    const extractJwtFromRequest = (req: Request): string | null => {
      // Primero intentar extraer de las cookies
      if (req?.cookies?.[this.ACCESS_TOKEN_COOKIE_NAME]) {
        return req.cookies[this.ACCESS_TOKEN_COOKIE_NAME];
      }

      // Si no hay cookie, intentar extraer del header
      const authHeader = req.headers['authorization'];
      if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7);
      }

      return null;
    };

    // Importante: Llamamos a super() con una función extractora definida localmente
    super({
      jwtFromRequest: extractJwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    // Validar que el payload contenga la información necesaria
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid token structure');
    }

    try {
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
        },
      });

      if (!user) {
        throw new UnauthorizedException(
          'User does not exist or token is invalid'
        );
      }

      // Devolver el usuario como objeto de dominio
      return new User(this.sanitizeUserData(user));
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error validating JWT: ${err.message}`, err.stack);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  // Método para convertir valores null a undefined para cumplir con el tipo User
  private sanitizeUserData(data: Record<string, any>): Partial<User> {
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = value === null ? undefined : value;
      return acc;
    }, {} as Record<string, any>);
  }
}
