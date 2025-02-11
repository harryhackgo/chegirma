import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { User } from "./users/models/user.model";
import { AuthModule } from "./auth/auth.module";
import { PhotoModule } from "./photo/photo.module";
import { CategoryModule } from "./category/category.module";
import { DiscountTypeModule } from "./discount_type/discount_type.module";
import { DistrictModule } from "./district/district.module";
import { RegionModule } from "./region/region.module";
import { SocialLinkModule } from "./social_link/social_link.module";
import { StoreSocialLinkModule } from "./store_social_link/store_social_link.module";
import { AdminModule } from "./admin/admin.module";
import { StoreSubscribeModule } from "./store_subscribe/store_subscribe.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { BotModule } from "./bot/bot.module";
import { TelegrafModule } from "nestjs-telegraf";
import { BOT_NAME } from "./app.constants";
import { DiscountType } from "./discount_type/models/discount_type.entity";
import { Admin } from "./admin/models/admin.model";
import { Category } from "./category/models/category.model";
import { District } from "./district/model/district.model";
import { Region } from "./region/model/region.model";
import { SocialLink } from "./social_link/models/social_link.entity";
import { StoreModule } from "./store/store.module";
import { StoreSocialLink } from "./store_social_link/models/store_social_link.model";
import { Bot } from "./bot/models/bot.model";
import { DiscountsModule } from "./discounts/discounts.module";
import { AdsModule } from "./ads/ads.module";
import { Ads } from "./ads/models/ad.model";
import { Discounts } from "./discounts/models/discount.model";
import { Favourite } from "./favorites/models/favorite.model";
import { Photo } from "./photo/models/photo.model";
import { Reviews } from "./reviews/models/review.model";
import { StoreSubscribe } from "./store_subscribe/models/store_subscribe.model";
import { Address } from "./bot/models/address.model";
import { Store } from "./store/models/store.model";

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN!,
        middlewares: [],
        include: [BotModule],
        options: {},
      }),
    }),
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      port: Number(process.env.POSTGRES_PORT),
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        DiscountType,
        Admin,
        Category,
        District,
        Region,
        SocialLink,
        StoreSocialLink,
        Bot,
        Address,
        Ads,
        Discounts,
        Favourite,
        Photo,
        Reviews,
        StoreSubscribe,
        Store,
      ],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),
    UsersModule,
    AuthModule,
    PhotoModule,
    CategoryModule,
    DiscountTypeModule,
    DistrictModule,
    RegionModule,
    SocialLinkModule,
    StoreSocialLinkModule,
    AdminModule,
    StoreSubscribeModule,
    FavoritesModule,
    ReviewsModule,
    BotModule,
    StoreModule,
    DiscountsModule,
    AdsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
