import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');

  app.use(
    session({
      cookie: {
        maxAge: 360000,
        httpOnly: config.getOrThrow<boolean>('SESSION_HTTP_ONLY'),
        sameSite: 'lax',
        secure: false,
      },
      resave: false,
      saveUninitialized: false,
      name: config.getOrThrow<string>('SESSION_NAME'),
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      store: new RedisStore({
        client: redisClient,
        prefix: config.getOrThrow<string>('SESSION_FOLDER'),
      }),
    }),
  );

  /**
   * Подключение и настройка документации к API
   * получить больше сведений по http://localhost${port}/docs
   */
  const docs = new DocumentBuilder()
    .setTitle('Ecommerce documentation')
    .setDescription('Серверная часть для интернет магазина')
    .setVersion('0.8.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, docs);
  SwaggerModule.setup('docs', app, documentFactory);

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  const port: number = config.get<number>('APPLICATION_PORT') ?? 3000;
  await app.listen(port).then(() => {
    console.info(`App running on http://localhost:${port}`);
  });
}
void bootstrap();
