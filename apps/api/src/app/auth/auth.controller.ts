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
  HttpStatus,
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
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    userId: string
  ) {
    // Configuración común para todas las cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite:
        process.env.NODE_ENV === 'production'
          ? 'none'
          : ('lax' as 'none' | 'lax'),
      path: '/',
    };

    // Configurar access token como cookie
    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    // Configurar refresh token como cookie
    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    // Configurar user_id como cookie no-httpOnly para acceso frontend
    res.cookie('user_id', userId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite:
        process.env.NODE_ENV === 'production'
          ? 'none'
          : ('lax' as 'none' | 'lax'),
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
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
      // Obtener tokens del servicio de autenticación
      const result = await this.authService.signIn(req.user);
      if (!result) throw new Error('Authentication failed');

      const { accessToken, refreshToken, user } = result;

      // Registrar para depuración
      console.log(
        `Google OAuth callback: Generando tokens para el usuario ${user.email} (${user.id})`
      );

      // Configurar maxAge para cookies
      const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutos
      const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 días

      // Configurar cookies - CRUCIAL: configuración más específica y debuggable
      console.log('Configurando cookie access_token...');
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Importante: 'lax' permitirá que la cookie se envíe en redirecciones
        path: '/',
        maxAge: accessTokenMaxAge,
      });

      console.log('Configurando cookie refresh_token...');
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Importante para redirecciones cross-site
        path: '/',
        maxAge: refreshTokenMaxAge,
      });

      console.log('Configurando cookie user_id...');
      res.cookie('user_id', String(user.id), {
        httpOnly: false, // Para que sea accesible desde JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: refreshTokenMaxAge,
      });

      // Verificar que las cookies se están estableciendo
      console.log(
        'Cookies establecidas. Headers:',
        JSON.stringify(res.getHeaders())
      );

      // Construir URL para redirección al dashboard
      const frontendUrl =
        this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
      console.log('URL frontend:', frontendUrl);

      // IMPORTANTE: Agregar hash con tokens como fallback
      // Este es un mecanismo alternativo en caso de que las cookies no funcionen
      const dashboardUrl = new URL(`${frontendUrl}/dashboard`);
      dashboardUrl.hash = `access_token=${accessToken}&refresh_token=${refreshToken}&user_id=${user.id}`;

      console.log('Redirigiendo a:', dashboardUrl.toString());
      return res.redirect(dashboardUrl.toString());
    } catch (error) {
      console.error('Error en la autenticación con Google:', error);

      const frontendUrl =
        this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
      const errorRedirectUrl = new URL(`${frontendUrl}/sign-in`);
      errorRedirectUrl.searchParams.append('error', 'google_auth_failed');

      return res.redirect(errorRedirectUrl.toString());
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
      if (!result) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Invalid credentials',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      const authResult = await this.authService.signIn(result);
      if (!authResult) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Authentication failed',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      const { accessToken, refreshToken, user } = authResult;

      // Set cookies
      this.setAuthCookies(res, accessToken, refreshToken, String(user.id));

      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        user,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Authentication error',
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: HttpStatus.UNAUTHORIZED,
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
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Email and password are required',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const existingUser = await this.authService.validateUserByEmail(
        createUserDto.email
      );
      if (existingUser) {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'Email already registered',
          statusCode: HttpStatus.CONFLICT,
        });
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

      return res.status(HttpStatus.CREATED).json({
        message: 'User registered successfully',
        user,
        statusCode: HttpStatus.CREATED,
      });
    } catch (error) {
      console.error('Registration error:', error);

      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
        });
      }

      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to register user',
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get('logout')
  @Public() // Hacemos público el endpoint de logout para que cualquiera pueda acceder
  async logout(@Res() res: express.Response): Promise<any> {
    try {
      // Eliminar cookies de autenticación
      res.clearCookie('access_token', { path: '/' });
      res.clearCookie('refresh_token', { path: '/' });
      res.clearCookie('user_id', { path: '/' });

      return res.status(HttpStatus.OK).json({
        message: 'Logged out successfully',
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error logging out',
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any, @Res() res: express.Response) {
    try {
      if (!req.user) {
        console.error('Usuario no disponible en la solicitud');
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'User not authenticated',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      const user = req.user;

      return res.status(HttpStatus.OK).json({
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        tier: user.tier,
        credits: user.credits,
      });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving user profile',
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Public()
  @Post('refresh')
  async refreshToken(@Req() req: any, @Res() res: express.Response) {
    try {
      // Extraer el refresh token de las cookies
      const refreshToken = req.cookies.refresh_token;
      console.log(
        'Refresh token recibido:',
        refreshToken ? 'presente' : 'ausente'
      );

      if (!refreshToken) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Refresh token not provided',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      // Decodificar el token para debugging (sin verificar)
      const decodedToken = await this.authService.decodeToken(refreshToken);
      console.log('Decodificando refresh token:', decodedToken);

      // Validar el refresh token
      const payload = await this.authService.validateRefreshToken(refreshToken);
      if (!payload) {
        console.error('Token inválido o expirado');
        // Borrar cookies en caso de token inválido
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });
        res.clearCookie('user_id', { path: '/' });

        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Invalid or expired refresh token',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      // Buscar el usuario
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        console.error(`Usuario no encontrado: ${payload.sub}`);
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'User not found',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      // Generar nuevos tokens
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.generateToken(user);

      // Actualizar cookies
      this.setAuthCookies(res, accessToken, newRefreshToken, String(user.id));

      console.log('Token actualizado correctamente para el usuario:', user.id);

      return res.status(HttpStatus.OK).json({
        message: 'Token refreshed successfully',
        statusCode: HttpStatus.OK,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImage: user.profileImage,
          tier: user.tier,
          credits: user.credits,
        },
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error refreshing token',
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
