import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './response/all-exception.filter';
import { ResponseService } from './response/response.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as secureSession from '@fastify/secure-session';
import { ConfigService } from '@nestjs/config';
import { SwaggerTheme } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ ignoreTrailingSlash: true }),
  );

  const theme = new SwaggerTheme('v3');
  const config = new DocumentBuilder()
    .setTitle('Updeight')
    .setDescription('The updeight API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    explorer: true,
    customCss: theme.getBuffer('dark'),
  });

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter, new ResponseService()),
  );

  const configService = app.get<ConfigService>(ConfigService);
  await app.register(secureSession, {
    secret: configService.getOrThrow('APP_SECRET'),
    salt: configService.getOrThrow('APP_SALT'),
    cookie: {
      maxAge: 604800,
      path: '/',
    },
  });

  console.log(configService.get('PORT') || 3000);
  await app.listen(configService.get('PORT') || 3000, '0.0.0.0');
}

bootstrap();
