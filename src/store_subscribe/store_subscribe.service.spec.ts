import { Test, TestingModule } from '@nestjs/testing';
import { StoreSubscribeService } from './store_subscribe.service';

describe('StoreSubscribeService', () => {
  let service: StoreSubscribeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreSubscribeService],
    }).compile();

    service = module.get<StoreSubscribeService>(StoreSubscribeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
