import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@auth/passport/jwt.strategy';
import { GoogleStrategy } from '@auth/passport/google.strategy';
import { JwtAuthGuard } from '@auth/guard/jwt-guard.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy,JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})


export class AuthModule { }
