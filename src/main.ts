import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const yamlDocPath = path.join(__dirname, '../doc/api.yaml');

  // const docApi = yaml.load(
  //   fs.readFileSync(yamlDocPath, 'utf8'),
  // ) as OpenAPIObject;

  // SwaggerModule.setup('/docs', app, docApi);

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
