import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotUpdate } from "./bot.update";
import { SequelizeModule } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { AddressService } from "./address.service";
import { Address } from "./models/address.model";
import { AddressUpdate } from "./address.update";
import { CarUpdate } from "./car.update";
import { CarService } from "./car.service";
import { Car } from "./models/car.model";

@Module({
  imports: [SequelizeModule.forFeature([Bot, Address, Car])],
  providers: [
    CarUpdate,
    CarService,
    AddressUpdate,
    AddressService,
    BotService,
    BotUpdate,
  ],
  exports: [BotService],
})
export class BotModule {}
