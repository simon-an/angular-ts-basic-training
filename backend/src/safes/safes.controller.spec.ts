import { Test, TestingModule } from '@nestjs/testing';
import { SafesController } from './safes.controller';
import { SafesService } from './safes.service';

describe('Safes Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SafesController],
      providers: [SafesService],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SafesController = module.get<SafesController>(
      SafesController,
    );
    expect(controller).toBeDefined();
  });
});
