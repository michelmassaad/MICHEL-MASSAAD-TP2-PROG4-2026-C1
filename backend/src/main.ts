import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permite requests desde local Y desde Vercel
  const origenesPermitidos = [
    'http://localhost:4200',
    process.env['FRONTEND_URL'], // ← URL de Vercel (se configura en Render)
  ].filter(Boolean); // filter(Boolean) elimina los undefined

  app.enableCors({
    origin: origenesPermitidos,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  await app.listen(process.env['PORT'] ?? 3000);
}
bootstrap();