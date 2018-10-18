import { Test, TestingModule } from '@nestjs/testing';
import { SafesService } from './safes.service';

describe('SafesService', () => {
  let service: SafesService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SafesService],
    }).compile();
    service = module.get<SafesService>(SafesService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
