import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('APPLICATION_PORT') ?? 3000;

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET') || 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: configService.get<number>('SESSION_AGE') || 36000,
      },
    }),
  );

  await app.listen(port).then(() => {
    console.info(`App running on http://localhost:${port}`);
  });
}
void bootstrap();
