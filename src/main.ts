import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  // const yamlDocPath = path.join(__dirname, '../doc/api.yaml');

  // const docApi = yaml.load(
  //   fs.readFileSync(yamlDocPath, 'utf8'),
  // ) as OpenAPIObject;

  // SwaggerModule.setup('/docs', app, docApi);

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
