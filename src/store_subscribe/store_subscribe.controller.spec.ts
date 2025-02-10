import { Test, TestingModule } from '@nestjs/testing';
import { StoreSubscribeController } from './store_subscribe.controller';
import { StoreSubscribeService } from './store_subscribe.service';

describe('StoreSubscribeController', () => {
  let controller: StoreSubscribeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreSubscribeController],
      providers: [StoreSubscribeService],
    }).compile();

    controller = module.get<StoreSubscribeController>(StoreSubscribeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
