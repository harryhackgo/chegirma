import { Module } from "@nestjs/common";
import { AdsService } from "./ads.service";
import { AdsController } from "./ads.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Ads } from "./models/ad.model";

@Module({
  imports: [SequelizeModule.forFeature([Ads])],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}
