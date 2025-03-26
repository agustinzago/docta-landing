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
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { error } from 'console';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  private getCookieOptions(maxAge: number, httpOnly = true) {
    return {
      httpOnly,
      secure: process.env.NODE_ENV === 'production',
      sameSite:
        process.env.NODE_ENV === 'production'
          ? ('none' as const)
          : ('lax' as const),
      path: '/',
      maxAge,
    };
  }

  private setAuthCookies(
    res: express.Response,
    accessToken: string,
    refreshToken: string,
    userId: string
  ) {
    const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutos
    const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 días

    // Access token cookie
    res.cookie(
      'access_token',
      accessToken,
      this.getCookieOptions(accessTokenMaxAge)
    );

    // Refresh token cookie
    res.cookie(
      'refresh_token',
      refreshToken,
      this.getCookieOptions(refreshTokenMaxAge)
    );

    // User ID cookie (accesible en el cliente)
    res.cookie(
      'user_id',
      userId,
      this.getCookieOptions(refreshTokenMaxAge, false)
    );
  }

  private getFrontendUrl(): string {
    return this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
  }

  private getUserResponseData(user: any) {
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
      if (!result) {
        throw new UnauthorizedException('Authentication failed');
      }

      const { accessToken, refreshToken, user } = result;
      this.logger.log(
        `Google OAuth: Generated tokens for user ${user.email} (${user.id})`
      );

      // Configurar cookies
      this.setAuthCookies(res, accessToken, refreshToken, String(user.id));

      // Construir URL para redirección con tokens como fallback
      const dashboardUrl = new URL(`${this.getFrontendUrl()}/dashboard`);
      dashboardUrl.hash = `access_token=${accessToken}&refresh_token=${refreshToken}&user_id=${user.id}`;

      return res.redirect(dashboardUrl.toString());
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Google auth error: ${err.message}`, err.stack);

      const errorRedirectUrl = new URL(`${this.getFrontendUrl()}/sign-in`);
      errorRedirectUrl.searchParams.append('error', 'google_auth_failed');

      return res.redirect(errorRedirectUrl.toString());
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: express.Response) {
    try {
      const user = await this.authService.validateCredentials(
        loginDto.email,
        loginDto.password
      );

      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Invalid credentials',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      const authResult = await this.authService.signIn(user);
      if (!authResult) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Authentication failed',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      const { accessToken, refreshToken, user: authenticatedUser } = authResult;
      this.setAuthCookies(
        res,
        accessToken,
        refreshToken,
        String(authenticatedUser.id)
      );

      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        user: this.getUserResponseData(authenticatedUser),
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Login error: ${err.message}`, err.stack);
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
        throw new BadRequestException('Email and password are required');
      }

      const existingUser = await this.authService.validateUserByEmail(
        createUserDto.email
      );
      if (existingUser) {
        throw new ConflictException('Email already registered');
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
        user: this.getUserResponseData(user),
        statusCode: HttpStatus.CREATED,
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Registration error: ${err.message}`, err.stack);

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
  @Public()
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
      const err = error as Error;
      this.logger.error(`Logout error: ${err.message}`, err.stack);
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
        throw new UnauthorizedException('User not authenticated');
      }

      return res.status(HttpStatus.OK).json(this.getUserResponseData(req.user));
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Profile error: ${err.message}`, err.stack);
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
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        throw new BadRequestException('Refresh token not provided');
      }

      // Validar el refresh token
      const payload = await this.authService.validateRefreshToken(refreshToken);
      if (!payload) {
        // Borrar cookies en caso de token inválido
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });
        res.clearCookie('user_id', { path: '/' });

        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Buscar el usuario
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generar nuevos tokens
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.generateTokens(user);

      // Actualizar cookies
      this.setAuthCookies(res, accessToken, newRefreshToken, String(user.id));

      this.logger.log(`Token refreshed for user: ${user.id}`);

      return res.status(HttpStatus.OK).json({
        message: 'Token refreshed successfully',
        statusCode: HttpStatus.OK,
        user: this.getUserResponseData(user),
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Refresh token error: ${err.message}`, err.stack);

      const statusCode =
        error instanceof BadRequestException
          ? HttpStatus.BAD_REQUEST
          : error instanceof UnauthorizedException
          ? HttpStatus.UNAUTHORIZED
          : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(statusCode).json({
        message:
          error instanceof Error ? error.message : 'Error refreshing token',
        statusCode,
      });
    }
  }
}
