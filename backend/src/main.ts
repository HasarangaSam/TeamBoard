import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module.js';
import { ApiExceptionFilter } from './common/filters/api-exception.filter.js';
import { RequestTimingInterceptor } from './common/interceptors/request-timing.interceptor.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: 'http://localhost:5173',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new RequestTimingInterceptor());
  app.useGlobalFilters(new ApiExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TeamBoard API')
    .setDescription(
      'API documentation for the TeamBoard interview-practice project.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT ?? 3000);

  await app.listen(port);

  console.log(`TeamBoard API running on http://localhost:${port}/api/v1`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

void bootstrap();
