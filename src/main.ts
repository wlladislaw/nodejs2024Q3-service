import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from './logger/logger.service';
import { LogExceptionFilter } from './logger/exception.filter';
import { LoggerInterceptor } from './logger/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggingService = app.get(LoggerService);

  process.on('uncaughtException', (err) => {
    loggingService.error('uncaught Exception', err.message, 'main context');
  });

  process.on('unhandledRejection', (mg: any) => {
    loggingService.error('unhandled Rejection', mg, 'main context');
  });

  app.useGlobalInterceptors(app.get(LoggerInterceptor));

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new LogExceptionFilter(httpAdapterHost, loggingService));

  const config = new DocumentBuilder()
    .setTitle('Home Library API')
    .setDescription(
      'Users can create, read, update, delete data about Artists, Tracks and Albums',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableShutdownHooks();
  const PORT = process.env.PORT ?? 4000;
  console.log(`Serveur coucou on ${PORT}`);
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
