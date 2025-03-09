import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config(); // Loads environment variables from .env file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(` Server running on http://localhost:${PORT}`);
}

bootstrap();
