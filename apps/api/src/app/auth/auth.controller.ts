import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import express, { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    userId: string
  ) {
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.cookie('user_id', userId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Este endpoint inicia el flujo de autenticación con Google
    // La redirección la maneja el guard
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: express.Response) {
    try {
      const result = await this.authService.signIn(req.user);
      if (!result) throw new Error('Authentication failed');

      const { accessToken, refreshToken, user } = result;
      this.setAuthCookies(res, accessToken, refreshToken, String(user.id));

      const redirectUrl = new URL(
        process.env.FRONTEND_URL || 'https://localhost:3000'
      );
      redirectUrl.pathname = req.user.logedFirstTime
        ? '/auth/welcome'
        : '/dashboard';
      return res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Error en la autenticación con Google:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res
        .status(400)
        .json({ message: 'Error de autenticación', error: errorMessage });
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: express.Response) {
    try {
      const result = await this.authService.validateCredentials(
        loginDto.email,
        loginDto.password
      );
      if (!result) throw new UnauthorizedException('Credenciales inválidas');

      const { accessToken, refreshToken, user } = await this.authService.signIn(
        result
      );
      this.setAuthCookies(res, accessToken, refreshToken, String(user.id));

      return res.status(200).json({ message: 'Login exitoso', user });
    } catch (error) {
      return res.status(401).json({
        message: 'Error de autenticación',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @Public()
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() res: express.Response
  ) {
    try {
      if (!createUserDto.email || !createUserDto.password) {
        throw new BadRequestException(
          'El correo y la contraseña son obligatorios'
        );
      }

      const existingUser = await this.authService.validateUserByEmail(
        createUserDto.email
      );
      if (existingUser) {
        throw new ConflictException(
          'Este correo electrónico ya está registrado'
        );
      }

      const result = await this.authService.registerUser({
        email: createUserDto.email,
        password: createUserDto.password,
        name: createUserDto.name || '',
        profileImage: createUserDto.profileImage,
        tier: 'Free',
        credits: '10',
      });

      const { accessToken, refreshToken, user } = result;
      this.setAuthCookies(res, accessToken, refreshToken, String(user.id));

      return res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res
          .status(409)
          .json({ message: error.message, error: 'ConflictException' });
      }
      if (error instanceof BadRequestException) {
        return res
          .status(400)
          .json({ message: error.message, error: 'BadRequestException' });
      }
      console.error('Error en el registro:', error);
      return res.status(500).json({
        message: 'Error al registrar el usuario',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Res() res: express.Response): Promise<any> {
    try {
      res.clearCookie('token');
      res.clearCookie('refresh_token');
      res.clearCookie('user_id');

      return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
      return res.status(500).json({
        message: 'Error al cerrar sesión',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    const user = req.user;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
      tier: user.tier,
      credits: user.credits,
    };
  }

  @Public()
  @Post('refresh')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Res() res: express.Response
  ) {
    try {
      if (!refreshToken) {
        throw new BadRequestException('Token de refresco no provisto');
      }

      const payload = await this.authService.validateRefreshToken(refreshToken);
      if (!payload) {
        throw new UnauthorizedException('Token de refresco inválido');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.generateToken(user);
      this.setAuthCookies(res, accessToken, newRefreshToken, String(user.id));

      return res.status(200).json({ accessToken });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(400).json({
          message: 'Error al refrescar el token',
          error: error.message,
        });
      }
      console.error('Error al refrescar el token:', error);
      return res.status(500).json({
        message: 'Error al refrescar el token',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
