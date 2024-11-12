import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function init() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.listen(process.env.PORT ?? 3000);
  console.log('Server is running on http://localhost:3000');
}
init();