import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { TransformInterceptor } from '@core/transform.interceptor';
import { AllExceptionsFilter } from '@core/exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 8080;
  const reflector = app.get(Reflector);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    origin: true, // hoặc cấu hình domain cụ thể
    credentials: true,
  });
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalFilters(new AllExceptionsFilter());
  //Có tác dụng để tự động validate các DTO đầu vào
  //whitelist: true => Loại bỏ các thuộc tính không được định nghĩa trong DTO
  //forbidNonWhitelisted: true => Ném lỗi nếu có thuộc tính không được định nghĩa trong DTO
  //transform: true => Tự động chuyển đổi các kiểu dữ liệu (string -> number, string -> boolean, ...)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  const config = new DocumentBuilder()
    .setTitle('Tài liệu API')
    .setDescription('Tài liệu mô tả toàn bộ API hệ thống')
    .setVersion('1.0')
    .addBearerAuth() // Nếu dùng JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // => http://localhost:3000/api-docs

  await app.listen(port);
  console.log(`App is running on http://localhost:${port}`);
}
bootstrap();
