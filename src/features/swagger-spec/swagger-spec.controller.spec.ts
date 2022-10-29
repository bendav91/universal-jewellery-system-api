import { Test, TestingModule } from '@nestjs/testing';
import { SwaggerSpecController } from './swagger-spec.controller';

describe('SwaggerSpecController', () => {
  let controller: SwaggerSpecController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwaggerSpecController],
    }).compile();

    controller = module.get<SwaggerSpecController>(SwaggerSpecController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
