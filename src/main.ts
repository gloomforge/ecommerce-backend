import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port: number = config.get<number>('APPLICATION_PORT') ?? 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000', // url to react app
    credentials: true,
  });

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: { 
        maxAge: 1000 * 60 * 60,
        httpOnly: config.getOrThrow<boolean>('SESSION_HTTP_ONLY'),
        secure: false,
        sameSite: 'lax',
      },
    }),
  );

  await app.listen(port).then(() => {
    console.info(`App running on http://localhost:${port}`);
  });
}
void bootstrap();
