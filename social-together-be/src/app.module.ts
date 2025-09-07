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
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },],
})
export class AppModule {}
