/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import 'reflect-metadata';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const connection = app.get<Connection>(getConnectionToken());
  
  connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
    if (connection.db) {
      console.log(`📦 Database: ${connection.db.databaseName}`);
    } else {
      console.warn('⚠️  Database object is undefined.');
    }
    console.log('🚀 MongoDB will auto-create collections when data is first written');
  });

  connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🎯 Application is running on: http://localhost:${port}`);
}

bootstrap();
