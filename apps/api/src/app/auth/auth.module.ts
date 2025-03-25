import { Module, Logger } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserModule } from '../users/user.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          Logger.error('JWT_SECRET not configured!');
          throw new Error('JWT_SECRET is required');
        }

        Logger.log('JwtModule initialized with JWT_SECRET');

        return {
          secret: secret,
          signOptions: {
            expiresIn: '15m',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
