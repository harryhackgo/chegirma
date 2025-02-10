import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateDiscountTypeDto } from "./dto/create-discount_type.dto";
import { UpdateDiscountTypeDto } from "./dto/update-discount_type.dto";
import { InjectModel } from "@nestjs/sequelize";
import { DiscountType } from "./models/discount_type.entity";

@Injectable()
export class DiscountTypeService {
  constructor(
    @InjectModel(DiscountType) private discountTypeModel: typeof DiscountType
  ) {}

  async create(createDiscountTypeDto: CreateDiscountTypeDto) {
    const discount_type = await this.discountTypeModel.create(
      createDiscountTypeDto
    );

    return discount_type;
  }

  async findAll() {
    return await this.discountTypeModel.findAll();
  }

  async findOne(id: number) {
    return await this.discountTypeModel.findByPk(id);
  }

  async update(id: number, updateDiscountTypeDto: UpdateDiscountTypeDto) {
    const discount_type = await this.discountTypeModel.findByPk(id);
    if (!discount_type)
      throw new BadRequestException("Discount type is not found");
    await discount_type.update(updateDiscountTypeDto);
    return discount_type;
  }

  async remove(id: number) {
    const discount_type = await this.discountTypeModel.findByPk(id);
    if (!discount_type)
      throw new BadRequestException("Discount type is not found");
    discount_type.destroy();
    return { message: "Discount type has been destroyed successfully" };
  }
}
