import { Action, Command, Ctx, Hears, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { CarService } from "./car.service";

@Update()
export class CarUpdate {
  constructor(private readonly carService: CarService) {}

  @Command("car")
  async onCar(@Ctx() ctx: Context) {
    await this.carService.onCar(ctx);
  }

  @Hears("Add a new car")
  async onCommandNewCar(@Ctx() ctx: Context) {
    await this.carService.onCommandNewCar(ctx);
  }

  @Hears("My cars")
  async onCommandMyCars(@Ctx() ctx: Context) {
    await this.carService.onCommandMyCars(ctx);
  }

  @Action(/^editCar_\d+$/)
  async onClickCar(@Ctx() ctx: Context) {
    await this.carService.onClickCar(ctx);
  }

  @Action(/^delCar_\d+$/)
  async onDelCar(@Ctx() ctx: Context) {
    await this.carService.onDelCar(ctx);
  }

  @Action(/^editNumber_\d+$/)
  async onClickNumber(@Ctx() ctx: Context) {
    await this.carService.onClickNumber(ctx);
  }

  @Action(/^editModel_\d+$/)
  async onClickModel(@Ctx() ctx: Context) {
    await this.carService.onClickModel(ctx);
  }

  @Action(/^editColor_\d+$/)
  async onClickColor(@Ctx() ctx: Context) {
    await this.carService.onClickColor(ctx);
  }

  @Action(/^editYear_\d+$/)
  async onClickYear(@Ctx() ctx: Context) {
    await this.carService.onClickYear(ctx);
  }
}
