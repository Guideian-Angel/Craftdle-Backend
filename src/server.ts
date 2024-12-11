import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as express from 'express';

async function init() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // CORS engedélyezése
  app.enableCors({
    origin: 'http://localhost:5173', // Csak erről a domainről érkező kéréseket engedélyezzük
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Engedélyezett HTTP metódusok
    allowedHeaders: 'Content-Type, Authorization', // Engedélyezett fejléc típusok
  });

  // Globális ValidationPipe hozzáadása
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Törli az ismeretlen mezőket
      forbidNonWhitelisted: true, // Hibát dob, ha ismeretlen mezőt talál
      transform: true, // DTO-kba alakítja az adatokat
      exceptionFactory: (validationErrors) => {
        const formattedErrors = validationErrors.reduce((acc, error) => {
          const { property, constraints } = error;
          acc[property] = Object.values(constraints);
          return acc;
        }, {});
        throw new BadRequestException(formattedErrors);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log('Server is running on http://localhost:3000');
}

init();