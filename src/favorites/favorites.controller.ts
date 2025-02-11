import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { FavouritesService } from "./favorites.service";
import { CreateFavouriteDto } from "./dto/create-favorite.dto";
import { UpdateFavouriteDto } from "./dto/update-favorite.dto";

@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavouritesService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavouriteDto) {
    return this.favoritesService.create(createFavoriteDto);
  }

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.favoritesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateFavoriteDto: UpdateFavouriteDto
  ) {
    return this.favoritesService.update(+id, updateFavoriteDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.favoritesService.remove(+id);
  }
}
