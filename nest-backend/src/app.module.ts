import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGO_DB_URL;
if (!mongoUri) {
  throw new Error('Mongo DB URL is not set');
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(mongoUri, {
      // Auto-create database and collections
      autoCreate: true,
      // Auto-index creation (creates indexes defined in schemas)
      autoIndex: true,
      // Connection options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
