import { Module } from "@nestjs/common";
import { DiscountsService } from "./discounts.service";
import { DiscountsController } from "./discounts.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Discounts } from "./models/discount.model";

@Module({
  imports: [SequelizeModule.forFeature([Discounts])],
  controllers: [DiscountsController],
  providers: [DiscountsService],
})
export class DiscountsModule {}
