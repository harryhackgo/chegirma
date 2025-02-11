import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Favourite } from "./models/favorite.model";
import { CreateFavouriteDto } from "./dto/create-favorite.dto";
import { UpdateFavouriteDto } from "./dto/update-favorite.dto";
import { User } from "../users/models/user.model";
import { Discounts } from "../discounts/models/discount.model";

@Injectable()
export class FavouritesService {
  constructor(
    @InjectModel(Favourite) private favouriteModel: typeof Favourite
  ) {}

  async create(createFavouriteDto: CreateFavouriteDto) {
    const newFavourite = await this.favouriteModel.create(createFavouriteDto);
    return newFavourite;
  }

  async findAll() {
    const favourites = await this.favouriteModel.findAll({
      include: [User, Discounts],
    });
    if (!favourites.length)
      throw new BadRequestException("No favourites found");
    return favourites;
  }

  async findOne(id: number) {
    const favourite = await this.favouriteModel.findByPk(id, {
      include: [User, Discounts],
    });
    if (!favourite) throw new BadRequestException("Favourite not found");
    return favourite;
  }

  async update(id: number, updateFavouriteDto: UpdateFavouriteDto) {
    const favourite = await this.favouriteModel.findByPk(id);
    if (!favourite) throw new BadRequestException("Favourite not found");
    return await favourite.update(updateFavouriteDto);
  }

  async remove(id: number) {
    const favourite = await this.favouriteModel.findByPk(id);
    if (!favourite) throw new BadRequestException("Favourite not found");
    await favourite.destroy();
    return { message: "Favourite has been removed successfully" };
  }
}
