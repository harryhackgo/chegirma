import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotUpdate } from "./bot.update";
import { SequelizeModule } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { AddressService } from "./address.service";
import { Address } from "./models/address.model";
import { AddressUpdate } from "./address.update";

@Module({
  imports: [SequelizeModule.forFeature([Bot, Address])],
  providers: [BotService, BotUpdate, AddressService, AddressUpdate],
  exports: [BotService],
})
export class BotModule {}
