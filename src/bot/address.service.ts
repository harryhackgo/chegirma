import { InjectBot } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { BOT_NAME } from "../app.constants";
import { InjectModel } from "@nestjs/sequelize";
import { Address } from "./models/address.model";
import { Bot } from "./models/bot.model";

export class AddressService {
  constructor(
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectModel(Bot) private readonly botModel: typeof Bot
  ) {}

  async onAddress(ctx: Context) {
    try {
      await ctx.reply(`Locations of users`, {
        parse_mode: "HTML",
        ...Markup.keyboard([["My locations", "Add a new location"]]).resize(),
      });
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onCommandNewAddress(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user || !user.status) {
        await ctx.reply(`You should first activate your account`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        await this.addressModel.create({ user_id, last_state: "name" });
        await ctx.reply(
          `Enter the name of the new location (example: <i>my home</i>)`,
          {
            parse_mode: "HTML",
            ...Markup.removeKeyboard(),
          }
        );
      }

      await ctx.reply(`Locations of users`, {
        parse_mode: "HTML",
        ...Markup.keyboard([["My locations", "Add a new location"]]).resize(),
      });
    } catch (error) {
      console.log("OnCommandNewAddress error", error);
    }
  }

  async onCommandMyLocations(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user || !user.status) {
        await ctx.reply(`You should first activate your account`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        const locations = await this.addressModel.findAll({
          where: { user_id, last_state: "finish" },
        });

        locations.forEach(async (location) => {
          await ctx.replyWithHTML(
            `<b>Location name:</b> ${location.name}\n<b>Location:</b> ${location.address}`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "View the location",
                      callback_data: `loc_${location.id}`,
                    },
                    {
                      text: "Delete",
                      callback_data: `del_${location.id}`,
                    },
                  ],
                ],
              },
            }
          );
        });
      }

      await ctx.reply(`Locations of users`, {
        parse_mode: "HTML",
        ...Markup.keyboard([["My locations", "Add a new location"]]).resize(),
      });
    } catch (error) {
      console.log("OnCommandNewAddress error", error);
    }
  }

  async onClickLocation(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const address_id = contextAction.split("_")[1];

      const address = await this.addressModel.findByPk(address_id);
      await ctx.replyWithLocation(
        Number(address?.location?.split(",")[0]),
        Number(address?.location?.split(",")[1])
      );
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onDelLocation(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const address_id = contextAction.split("_")[1];

      const address = await this.addressModel.findByPk(address_id);
      address?.destroy();
      await this.onCommandMyLocations(ctx);
    } catch (error) {
      console.log("OnStop error", error);
    }
  }
}
