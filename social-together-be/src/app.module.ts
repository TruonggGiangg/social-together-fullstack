import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { UsersModule } from '@users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/guard/jwt-guard.strategy';
import { AuthModule } from '@auth/auth.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CombinedAuthGuard } from '@guard/combined-auth.guard';

@Module({
  imports: [
     MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('URL_MONGODB'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        }
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Đảm bảo có thể dùng ở mọi module
    }),

     WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({ filename: 'app.log' }),
      ],
     }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 3, // Số yêu cầu tối đa trong TTL
          ttl: 1000, 
          blockDuration: 2000,  // Thời gian bị chặn nếu vượt quá giới hạn
        },
      ],
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CombinedAuthGuard,
    },
    ThrottlerGuard
  ],
})
export class AppModule {}
