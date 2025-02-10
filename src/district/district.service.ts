import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";
import { District } from "./model/district.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class DistrictService {
  constructor(@InjectModel(District) private districtModel: typeof District) {}

  async create(createDistrictDto: CreateDistrictDto): Promise<District> {
    return await this.districtModel.create(createDistrictDto);
  }

  async findAll(): Promise<District[]> {
    return await this.districtModel.findAll();
  }

  async findOne(id: number): Promise<District> {
    const district = await this.districtModel.findByPk(id);
    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }
    return district;
  }

  async update(
    id: number,
    updateDistrictDto: UpdateDistrictDto
  ): Promise<District> {
    const district = await this.findOne(id);
    await district.update(updateDistrictDto);
    return district;
  }

  async remove(id: number): Promise<void> {
    const district = await this.findOne(id);
    await district.destroy();
  }
}
