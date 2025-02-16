import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Address } from "./models/address.model";
import { Car } from "./models/car.model";
import { Edits } from "./car.service";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectModel(Car) private readonly carModel: typeof Car,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async start(ctx: Context) {
    const user_id = ctx.from!.id;
    const user = await this.botModel.findByPk(user_id);
    if (!user) {
      await this.botModel.create({
        user_id,
        username: ctx.from?.username,
        first_name: ctx.from?.first_name,
        last_name: ctx.from?.last_name,
        lang: ctx.from?.language_code,
      });
      await ctx.reply(
        `Please, press the <b>Send phone number 📞</b> button in menu`,
        {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [Markup.button.contactRequest("<b>Send phone number 📞</b>")],
          ])
            .resize()
            .oneTime(),
        }
      );
    } else if (!user.status) {
      await ctx.reply(
        `Please, press the <b>Send phone number 📞</b> button in menu`,
        {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [Markup.button.contactRequest("Send phone number 📞")],
          ])
            .resize()
            .oneTime(),
        }
      );
    } else {
      await this.bot.telegram.sendChatAction(user_id, "typing");
      await ctx.reply(`Welcome back ${user.first_name}`, {
        parse_mode: "HTML",
        ...Markup.removeKeyboard(),
      });
    }
  }

  async onContact(ctx: Context) {
    if ("contact" in ctx.message!) {
      const user_id = ctx.from!.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await ctx.reply(`Please, press the <b>Start</b> button in menu`, {
          parse_mode: "HTML",
          ...Markup.keyboard(["/start"]).resize().oneTime(),
        });
      } else if (ctx.message!.contact.user_id != user_id) {
        await ctx.reply(`Please, send your own contact number!`, {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [Markup.button.contactRequest("Send phone number 📞")],
          ])
            .resize()
            .oneTime(),
        });
      } else {
        user.phone_number = ctx.message.contact.phone_number;
        user.status = true;
        await user.save();
        await ctx.reply(
          `Congratulations! Your account has been activated successfully.`,
          {
            parse_mode: "HTML",
            ...Markup.removeKeyboard(),
          }
        );
      }
    }
  }

  async onLocation(ctx: Context) {
    try {
      if ("location" in ctx.message!) {
        const user_id = ctx.from!.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user || !user.status) {
          await ctx.reply(`You should first activate your account`, {
            parse_mode: "HTML",
            ...Markup.keyboard([["/start"]]).resize(),
          });
        } else {
          const address = await this.addressModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]],
          });

          if (address && address.last_state == "location") {
            address.location = `${ctx.message.location.latitude},${ctx.message.location.longitude}`;
            address.last_state = "finish";
            await address.save();
            await ctx.reply("Adress has been saved successfully!", {
              parse_mode: "HTML",
              ...Markup.keyboard([
                ["My locations", "Add a new location"],
              ]).resize(),
            });
          }
        }
      }
    } catch (error) {
      console.log("OnLocation error", error);
    }
  }

  async deleteUncaughtMessage(ctx: Context) {
    try {
      const contextMessage = ctx.message?.message_id;
      console.log(contextMessage);

      await ctx.deleteMessage(contextMessage);
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async sendOtp(
    phone_number: string,
    otp: string
  ): Promise<boolean | undefined> {
    try {
      const user = await this.botModel.findOne({ where: { phone_number } });

      if (!user || !user.status) {
        return false;
      }

      await this.bot.telegram.sendMessage(
        user.user_id!,
        `Virification code: ${otp}`
      );
      return true;
    } catch (error) {
      console.log("OnOtp error", error);
    }
  }

  async admin_menu(ctx: Context, menu_text = `<b>Admin menu</b>`) {
    try {
      await ctx.reply(menu_text, {
        parse_mode: "HTML",
        ...Markup.keyboard([["Clients", "Masters"]])
          .oneTime()
          .resize(),
      });
    } catch (error) {
      console.log("Error in admin menu", error);
    }
  }

  async onText(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const user_id = ctx.from!.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user || !user.status) {
          await ctx.reply(`You should first activate your account`, {
            parse_mode: "HTML",
            ...Markup.keyboard([["/start"]]).resize(),
          });
        } else {
          const address = await this.addressModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]],
          });

          if (Edits[0]) {
            const { field, car_id: id } = Edits[0];
            const car = await this.carModel.findOne({
              where: { id },
            });
            if (field == "car_number") {
              const car_number = ctx.message.text;
              if (!/^[A-Z]\d{3}[A-Z]{2}$/i.test(car_number)) {
                return await ctx.reply(`Send the proper number please`, {
                  parse_mode: "HTML",
                });
              }
              car!.car_number = ctx.message.text.toUpperCase();
              await car!.save();
            } else if (field == "year") {
              const inputYear = parseInt(ctx.message.text, 10);
              const currentYear = new Date().getFullYear();

              if (
                !isNaN(inputYear) &&
                inputYear >= 1700 &&
                inputYear <= currentYear
              ) {
                car!.year = new Date(inputYear, 0, 1);
                await car!.save();
              } else {
                await ctx.reply(
                  `Invalid year, please enter a proper year (ex: 2006)`,
                  {
                    parse_mode: "HTML",
                    ...Markup.removeKeyboard(),
                  }
                );
              }
            } else {
              car![field] = ctx.message.text;
              car!.save();
            }

            Edits.pop();
            await ctx.replyWithHTML("Here is the modified car:");
            await ctx.replyWithHTML(
              `<b>Car number:</b> ${car!.car_number}\n<b>Model:</b> ${car!.model}\n<b>Color:</b> ${car!.color}\n<b>Model:</b> ${car!.year.getFullYear()}`,
              {
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: "Edit",
                        callback_data: `editCar_${car!.id}`,
                      },
                      {
                        text: "Delete",
                        callback_data: `delCar_${car!.id}`,
                      },
                    ],
                  ],
                },
              }
            );
            return;
          }

          const car = await this.carModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]],
          });

          if (address && address.last_state != "finish") {
            if (address.last_state == "name") {
              address.name = ctx.message.text;
              address.last_state = "address";
              await address.save();
              await ctx.reply(`Enter the address: `, {
                parse_mode: "HTML",
                ...Markup.removeKeyboard(),
              });
            } else if (address.last_state == "address") {
              address.address = ctx.message.text;
              address.last_state = "location";
              await address.save();
              await ctx.reply(`Send the location please: `, {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  [Markup.button.locationRequest(`🌐 Send the location`)],
                ]).resize(),
              });
            }
          } else if (car && car.last_state != "finish") {
            if (car.last_state == "car_number") {
              const car_number = ctx.message.text;
              if (!/^[A-Z]\d{3}[A-Z]{2}$/i.test(car_number)) {
                return await ctx.reply(`Send the proper number please`, {
                  parse_mode: "HTML",
                });
              }
              car.car_number = ctx.message.text.toUpperCase();
              car.last_state = "model";
              await car.save();
              await ctx.reply(`Enter the car model: `, {
                parse_mode: "HTML",
                ...Markup.removeKeyboard(),
              });
            } else if (car.last_state == "model") {
              car.model = ctx.message.text;
              car.last_state = "color";
              await car.save();
              await ctx.reply(`Enter the car's color: `, {
                parse_mode: "HTML",
                ...Markup.removeKeyboard(),
              });
            } else if (car.last_state == "color") {
              car.color = ctx.message.text;
              car.last_state = "year";
              await car.save();
              await ctx.reply(`Enter the car's year of production: `, {
                parse_mode: "HTML",
                ...Markup.removeKeyboard(),
              });
            } else if (car.last_state == "year") {
              const inputYear = parseInt(ctx.message.text, 10);
              const currentYear = new Date().getFullYear();

              if (
                !isNaN(inputYear) &&
                inputYear >= 1700 &&
                inputYear <= currentYear
              ) {
                car.year = new Date(inputYear, 0, 1);
                car.last_state = "finish";
                await car.save();
                await ctx.reply(`The car has been saved successfully`, {
                  parse_mode: "HTML",
                  ...Markup.keyboard([["My cars", "Add a new car"]]).resize(),
                });
              } else {
                await ctx.reply(
                  `Invalid year, please enter a proper year (ex: 2006)`,
                  {
                    parse_mode: "HTML",
                    ...Markup.removeKeyboard(),
                  }
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.log("OnText unexpeced error:", error);
    }
  }
}
