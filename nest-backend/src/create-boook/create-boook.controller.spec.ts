import { Test, TestingModule } from '@nestjs/testing';
import { CreateBoookController } from './create-boook.controller';
import { CreateBoookService } from './create-boook.service';

describe('CreateBoookController', () => {
  let controller: CreateBoookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateBoookController],
      providers: [CreateBoookService],
    }).compile();

    controller = module.get<CreateBoookController>(CreateBoookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
