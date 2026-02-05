import { Test, TestingModule } from '@nestjs/testing';
import { CreateBoookService } from './create-boook.service';

describe('CreateBoookService', () => {
  let service: CreateBoookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateBoookService],
    }).compile();

    service = module.get<CreateBoookService>(CreateBoookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
