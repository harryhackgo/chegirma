import { Module } from '@nestjs/common';
import { StoreSubscribeService } from './store_subscribe.service';
import { StoreSubscribeController } from './store_subscribe.controller';

@Module({
  controllers: [StoreSubscribeController],
  providers: [StoreSubscribeService],
})
export class StoreSubscribeModule {}
