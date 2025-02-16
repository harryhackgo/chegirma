import { InjectBot } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { BOT_NAME } from "../app.constants";
import { InjectModel } from "@nestjs/sequelize";
import { Car } from "./models/car.model";
import { Bot } from "./models/bot.model";

export class CarService {
  constructor(
    @InjectModel(Car) private readonly carModel: typeof Car,
    @InjectModel(Bot) private readonly botModel: typeof Bot
  ) {}

  async onCar(ctx: Context) {
    try {
      await ctx.reply(`Do you want to view your cars or add a new one?`, {
        parse_mode: "HTML",
        ...Markup.keyboard([["My cars", "Add a new car"]]).resize(),
      });
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onCommandNewCar(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user || !user.status) {
        await ctx.reply(`You should first activate your account`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        await this.carModel.create({ user_id, last_state: "car_number" });
        await ctx.reply(
          `Enter the registered number of the new car (example: <i>S607NB</i>)`,
          {
            parse_mode: "HTML",
            ...Markup.removeKeyboard(),
          }
        );
      }
    } catch (error) {
      console.log("OnCommandNewCar error", error);
    }
  }

  async onCommandMyCars(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user || !user.status) {
        await ctx.reply(`You should first activate your account`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        const cars = await this.carModel.findAll({
          where: { user_id, last_state: "finish" },
        });

        cars.forEach(async (car) => {
          await ctx.replyWithHTML(
            `<b>Car number:</b> ${car.car_number}\n<b>Model:</b> ${car.model}\n<b>Color:</b> ${car.color}\n<b>Model:</b> ${car.year.getFullYear()}`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Edit",
                      callback_data: `editCar_${car.id}`,
                    },
                    {
                      text: "Delete",
                      callback_data: `delCar_${car.id}`,
                    },
                  ],
                ],
              },
            }
          );
        });
      }
    } catch (error) {
      console.log("OnCommandNewCar error", error);
    }
  }

  async onClickCar(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const car_id = contextAction.split("_")[1];
      await ctx.editMessageReplyMarkup({
        inline_keyboard: [
          [
            { text: "Number", callback_data: `editNumber_${car_id}` },
            { text: "Model", callback_data: `editModel_${car_id}` },
          ],
          [
            { text: "Color", callback_data: `editColor_${car_id}` },
            { text: "Year", callback_data: `editYear_${car_id}` },
          ],
        ],
      });

      // const car = await this.carModel.findByPk(car_id);

      // await ctx.deleteMessage(contextMessage?.message_id);
      // await ctx.deleteMessage(contextMessage?.message_id! - 1);
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onClickNumber(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const car_id = contextAction.split("_")[1];

      Edits.push({ field: "car_number", car_id });
      await ctx.replyWithHTML("Send a new car number: ");
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onClickModel(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const car_id = contextAction.split("_")[1];

      Edits.push({ field: "model", car_id });
      await ctx.replyWithHTML("Send a new car model: ");
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onClickColor(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const car_id = contextAction.split("_")[1];

      Edits.push({ field: "car_color", car_id });
      await ctx.replyWithHTML("Send a new car color: ");
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onClickYear(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const car_id = contextAction.split("_")[1];

      Edits.push({ field: "car_year", car_id });
      await ctx.replyWithHTML("Send a new car year:");
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onDelCar(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const car_id = contextAction.split("_")[1];

      const car = await this.carModel.findByPk(car_id);
      car?.destroy();

      await ctx.editMessageText("Car has been deleted");
    } catch (error) {
      console.log("OnStop error", error);
    }
  }
}

interface Edit {
  field: string;
  car_id: string | number;
}

export var Edits: Edit[] = [];
