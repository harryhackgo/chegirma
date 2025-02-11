import { Module } from "@nestjs/common";
import { FavouritesService } from "./favorites.service";
import { FavoritesController } from "./favorites.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Favourite } from "./models/favorite.model";

@Module({
  imports: [SequelizeModule.forFeature([Favourite])],
  controllers: [FavoritesController],
  providers: [FavouritesService],
})
export class FavoritesModule {}
