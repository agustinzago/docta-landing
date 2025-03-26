import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';

export interface TokenPayload {
  sub: string;
  email: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: Partial<User>;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  async signIn(user: User): Promise<AuthResult | null> {
    try {
      if (!user?.id) {
        this.logger.error(
          'Intento de inicio de sesión con usuario inválido',
          user
        );
        return null;
      }

      return this.generateTokens(user);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error en signIn: ${err.message}`, err.stack);
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

  async registerUser(userData: Partial<User>): Promise<AuthResult> {
    if (!userData.email) {
      throw new BadRequestException('El email es requerido');
    }

    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestException('Ya existe un usuario con ese email');
    }

    const userToCreate = {
      ...userData,
      email: userData.email,
      password: userData.password
        ? await this.hashPassword(userData.password)
        : undefined,
    };

    // Delegamos la creación al servicio de usuarios
    const newUser = await this.userService.create(userToCreate as any);
    return this.generateTokens(newUser);
  }

  async generateTokens(user: User): Promise<AuthResult> {
    const payload: TokenPayload = { sub: user.id, email: user.email };
    const accessTokenSecret = this.configService.get<string>('JWT_SECRET');
    const refreshTokenSecret = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_KEY'
    );

    if (!accessTokenSecret || !refreshTokenSecret) {
      this.logger.error('JWT secrets no están configurados correctamente');
      throw new Error('JWT secrets are not defined');
    }

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessTokenSecret,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshTokenSecret,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: this.getUserResponseData(user),
    };
  }

  async validateRefreshToken(token: string): Promise<TokenPayload | null> {
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }

    try {
      const refreshTokenSecret = this.configService.get<string>(
        'JWT_REFRESH_TOKEN_KEY'
      );
      if (!refreshTokenSecret) {
        this.logger.error('JWT_REFRESH_TOKEN_KEY no está configurado');
        throw new Error('JWT_REFRESH_TOKEN_KEY is not defined');
      }

      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: refreshTokenSecret,
      });

      return payload;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error validando refresh token: ${err.message}`,
        err.stack
      );
      return null;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private getUserResponseData(user: User): Partial<User> {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
      tier: user.tier,
      credits: user.credits,
    };
  }

  async validateUserByEmail(email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }
}
