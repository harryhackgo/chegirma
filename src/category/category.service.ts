import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Category } from "./models/category.model";

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = await this.categoryModel.create(createCategoryDto);
    return newCategory;
  }

  async findAll() {
    const categores = await this.categoryModel.findAll();
    if (!categores) throw new BadRequestException("There is not category yet");
    return categores;
  }

  async findOne(id: number) {
    const category = this.categoryModel.findByPk(id);
    if (!category) throw new BadRequestException("Category was not found");
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) throw new BadRequestException("Category was not found");
    const updatedCategory = await category.update(updateCategoryDto);

    return updatedCategory;
  }

  async remove(id: number) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) throw new BadRequestException("Category was not found");
    await category.destroy();
    return { message: "Category has been destroyed successfully" };
  }
}
