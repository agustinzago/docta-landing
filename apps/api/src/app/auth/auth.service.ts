import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async signIn(user: User) {
    const userExists = await this.userService.findByEmail(user.email);
    if (!userExists) {
      return await this.registerUser(user);
    }
    return this.generateToken(userExists);
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

  async generateToken(user: User) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

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
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload, { expiresIn: '15m' });
  }

  async validateRefreshToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
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
