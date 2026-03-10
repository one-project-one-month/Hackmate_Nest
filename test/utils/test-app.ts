import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { useContainer } from 'class-validator';

import { AppModule } from '../../src/app.module';
import validationOptions from '../../src/utils/validation-options';
import { AllConfigType } from '../../src/config/config.type';
import { ResolvePromisesInterceptor } from '../../src/utils/serializer.interceptor';

let appInstance: INestApplication | null = null;
let appInitPromise: Promise<INestApplication> | null = null;

export async function getTestApp(): Promise<INestApplication> {
  if (appInstance) return appInstance;
  if (appInitPromise) return appInitPromise;

  process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
  process.env.ALLOW_FAKE_AUTH = process.env.ALLOW_FAKE_AUTH ?? 'true';

  appInitPromise = (async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    const configService = app.get(ConfigService<AllConfigType>);

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

    await app.init();
    appInstance = app;
    return app;
  })();

  return appInitPromise;
}

export async function closeTestApp(): Promise<void> {
  if (!appInstance) return;
  await appInstance.close();
  appInstance = null;
  appInitPromise = null;
}
