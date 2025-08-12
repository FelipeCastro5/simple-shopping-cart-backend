import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseUtil } from './application/utilities/response.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 🚫 Desactiva ETag (304 Not Modified)
  app.getHttpAdapter().getInstance().disable('etag');

  // 🚫 Fuerza a que nunca se cacheen respuestas
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((err) =>
          Object.values(err.constraints || {})
        );
        return new BadRequestException(ResponseUtil.error(messages.join(', ')));
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API de Proyectos')
    .setDescription('Documentacion de la api de proyectos')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
