import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Address } from "./models/address.model";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
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
      }
    } catch (error) {
      console.log("OnLocation error", error);
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
          }
        }
      }
    } catch (error) {
      console.log("OnText unexpeced error:", error);
    }
  }

  findAll() {
    return `This action returns all bot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bot`;
  }

  remove(id: number) {
    return `This action removes a #${id} bot`;
  }
}
