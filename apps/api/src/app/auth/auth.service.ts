import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  // Método para iniciar sesión y generar tokens JWT
  async signIn(user: any) {
    try {
      // Verificar que el usuario exista
      if (!user || !user.id) {
        console.error('signIn: Usuario inválido', user);
        return null;
      }

      // Generar tokens
      const tokens = await this.generateToken(user);
      console.log(`signIn: Tokens generados para usuario ${user.id}`);

      return tokens;
    } catch (error) {
      console.error('Error en signIn:', error);
      throw error;
    }
  }

  async validateCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.password) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async registerUser(userData: Partial<User>) {
    try {
      if (!userData.email)
        throw new BadRequestException('El email es requerido');

      const existingUser = await this.userService.findByEmail(userData.email);
      if (existingUser)
        throw new BadRequestException('Ya existe un usuario con ese email');

      const newUser = await this.prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          profileImage: userData.profileImage,
          googleId: userData.googleId,
          googleEmail: userData.googleEmail,
          refreshToken: userData.refreshToken,
          tier: userData.tier || 'Free',
          credits: userData.credits || '10',
          ...(userData.password && {
            password: await this.hashPassword(userData.password),
          }),
        },
      });

      return this.generateToken(new User(newUser));
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error('Error al registrar usuario:', error);
      throw new BadRequestException('No se pudo crear el usuario');
    }
  }

  // Método para generar tokens JWT
  async generateToken(user: any) {
    try {
      const payload = { sub: user.id, email: user.email };

      // Obtener secreto del ConfigService
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        console.error('JWT_SECRET no está configurado');
        throw new Error('JWT_SECRET is not defined');
      }

      // Generar tokens con el secreto configurado
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: secret,
        expiresIn: '15m',
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: secret,
        expiresIn: '7d',
      });

      console.log(
        `generateToken: Tokens generados correctamente para ${user.id}`
      );

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImage: user.profileImage,
          tier: user.tier,
          credits: user.credits,
        },
      };
    } catch (error) {
      console.error('Error generando tokens:', error);
      throw error;
    }
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload, { expiresIn: '15m' });
  }

  // Actualizar el método validateRefreshToken
  async validateRefreshToken(token: string): Promise<any> {
    try {
      console.log('Validando refresh token');

      // Verificar que el token no esté vacío
      if (!token || token === 'undefined' || token === 'null') {
        console.error('Token vacío o inválido');
        return null;
      }

      // Obtener el secreto usando el ConfigService
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        console.error('JWT_SECRET no está configurado');
        throw new Error('JWT_SECRET is not defined');
      }

      // Verificar el token con el secreto obtenido del ConfigService
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });

      console.log('Token validado correctamente para el usuario:', payload.sub);
      return payload;
    } catch (error) {
      console.error('Error validando refresh token:', error);
      return null;
    }
  }

  async decodeToken(token: string): Promise<any> {
    try {
      if (!token || token === 'undefined' || token === 'null') {
        return null;
      }
      return this.jwtService.decode(token);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async validateJwtPayload(payload: any): Promise<User | null> {
    return this.userService.findOne(payload.sub);
  }

  async validateUserByEmail(email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }
}
