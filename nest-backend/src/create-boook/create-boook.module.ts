import { Module } from '@nestjs/common';
import { CreateBoookService } from './create-boook.service';
import { CreateBoookController } from './create-boook.controller';

@Module({
  controllers: [CreateBoookController],
  providers: [CreateBoookService],
})
export class CreateBoookModule {}
