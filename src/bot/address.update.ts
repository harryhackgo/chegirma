import { Action, Command, Ctx, Hears } from "nestjs-telegraf";
import { Context } from "telegraf";
import { AddressService } from "./address.service";

export class AddressUpdate {
  constructor(private readonly addressService: AddressService) {}

  @Command("address")
  async onAddress(@Ctx() ctx: Context) {
    await this.addressService.onAddress(ctx);
  }

  @Hears("Add a new location")
  async onCommandNewAddress(@Ctx() ctx: Context) {
    await this.addressService.onCommandNewAddress(ctx);
  }

  @Hears("My locations")
  async onCommandMyLocations(@Ctx() ctx: Context) {
    await this.addressService.onCommandMyLocations(ctx);
  }

  @Action(/$loc_+\d+/)
  async onClickLocation(@Ctx() ctx: Context) {
    await this.addressService.onClickLocation(ctx);
  }

  @Action(/$del_+\d+/)
  async onDelLocation(@Ctx() ctx: Context) {
    await this.addressService.onDelLocation(ctx);
  }
}
