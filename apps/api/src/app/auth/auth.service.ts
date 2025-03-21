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
    // Verificar que el usuario existe
    const userExists = await this.userService.findByEmail(user.email);

    if (!userExists) {
      // Si no existe, lo creamos (para casos de autenticación OAuth)
      return await this.registerUser(user);
    }

    // Generar JWT para usuario existente
    return this.generateToken(userExists);
  }

  async validateCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    // Buscar usuario por email
    const user = await this.userService.findByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async registerUser(userData: Partial<User>) {
    try {
      // Verificar que el email existe
      if (!userData.email) {
        throw new BadRequestException('El email es requerido');
      }

      // Verificar si ya existe un usuario con ese email
      const existingUser = await this.userService.findByEmail(userData.email);

      if (existingUser) {
        throw new BadRequestException('Ya existe un usuario con ese email');
      }

      // Crear un nuevo usuario
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
          // Si es registro tradicional y hay password, lo hasheamos
          ...(userData.password && {
            password: await this.hashPassword(userData.password),
          }),
        },
      });

      // Generar token para el nuevo usuario
      return this.generateToken(new User(newUser));
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error al registrar usuario:', error);
      throw new BadRequestException('No se pudo crear el usuario');
    }
  }

  async generateToken(user: User) {
    // Definimos el payload del JWT
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // Generamos el token
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
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

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async validateJwtPayload(payload: any): Promise<User | null> {
    return this.userService.findOne(payload.sub);
  }
}
