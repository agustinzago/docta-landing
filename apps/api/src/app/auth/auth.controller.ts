import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

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
      // Obtenemos el token JWT
      const result = await this.authService.signIn(req.user);
      if (!result) {
        throw new Error('Authentication failed');
      }
      const { accessToken } = result;

      // Establecemos cookies seguras
      res.cookie('token', accessToken, {
        httpOnly: true, // Para mayor seguridad, hacemos la cookie httpOnly
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'lax', // Protección contra CSRF
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      });

      // ID del usuario (puede ser útil para el frontend)
      res.cookie('user_id', req.user.id, {
        httpOnly: false, // Accesible desde JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Redirigir según el estado del usuario
      const redirectUrl = new URL(
        process.env.FRONTEND_URL || 'https://localhost:3000'
      );

      // Si es la primera vez que el usuario inicia sesión
      if (req.user.logedFirstTime) {
        redirectUrl.pathname = '/auth/welcome';
        return res.redirect(redirectUrl.toString());
      }

      // Redirección normal a la página principal
      redirectUrl.pathname = '/dashboard';
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
      // Autenticación con email/password
      const result = await this.authService.validateCredentials(
        loginDto.email,
        loginDto.password
      );

      if (!result) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Generar JWT y establecer cookies
      const signInResult = await this.authService.signIn(result);

      if (!signInResult) {
        throw new UnauthorizedException('Error generando token');
      }

      const { accessToken } = signInResult;
      const user = result; // Use the validated user directly

      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.cookie('user_id', user.id, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: 'Login exitoso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      return res.status(401).json({
        message: 'Error de autenticación',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Res() res: express.Response): Promise<any> {
    try {
      // Limpiar cookies
      res.clearCookie('token');
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
    // Devuelve información del usuario autenticado
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
}
