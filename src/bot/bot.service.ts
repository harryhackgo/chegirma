import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
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
