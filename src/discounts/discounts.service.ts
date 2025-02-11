import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Discounts } from "./models/discount.model";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { UpdateDiscountDto } from "./dto/update-discount.dto";
import { Store } from "../store/models/store.model";
import { Category } from "../category/models/category.model";
import { DiscountType } from "../discount_type/models/discount_type.entity";
import { Photo } from "../photo/models/photo.model";
import { Reviews } from "../reviews/models/review.model";
import { Favourite } from "../favorites/models/favorite.model";

@Injectable()
export class DiscountsService {
  constructor(
    @InjectModel(Discounts) private discountsModel: typeof Discounts
  ) {}

  async create(createDiscountDto: CreateDiscountDto) {
    const newDiscount = await this.discountsModel.create(createDiscountDto);
    return newDiscount;
  }

  async findAll() {
    const discounts = await this.discountsModel.findAll({
      include: [Store, Category, DiscountType, Photo, Reviews, Favourite],
    });
    if (!discounts.length) throw new BadRequestException("No discounts found");
    return discounts;
  }

  async findOne(id: number) {
    const discount = await this.discountsModel.findByPk(id, {
      include: [Store, Category, DiscountType, Photo, Reviews, Favourite],
    });
    if (!discount) throw new BadRequestException("Discount not found");
    return discount;
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const discount = await this.discountsModel.findByPk(id);
    if (!discount) throw new BadRequestException("Discount not found");
    return await discount.update(updateDiscountDto);
  }

  async remove(id: number) {
    const discount = await this.discountsModel.findByPk(id);
    if (!discount) throw new BadRequestException("Discount not found");
    await discount.destroy();
    return { message: "Discount has been deleted successfully" };
  }
}
