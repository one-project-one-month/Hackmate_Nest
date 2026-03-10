import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    { exclude: ['/'] },
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  app.useGlobalInterceptors(
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const nodeEnv = configService.getOrThrow('app.nodeEnv', { infer: true });
  const frontendDomain = configService.get('app.frontendDomain', {
    infer: true,
  });

  if (
    nodeEnv === 'production' &&
    !frontendDomain &&
    !process.env.WS_CORS_ORIGIN
  ) {
    throw new Error(
      'FRONTEND_DOMAIN or WS_CORS_ORIGIN must be set in production',
    );
  }

  app.enableCors({
    origin: frontendDomain ?? (nodeEnv === 'production' ? false : true),
    credentials: true,
  });

  if (nodeEnv !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Chat Service API')
      .setDescription('Chat Microservice API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

void bootstrap();
