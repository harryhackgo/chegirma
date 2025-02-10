import { Injectable } from "@nestjs/common";
import { CreateStoreSocialLinkDto } from "./dto/create-store_social_link.dto";
import { UpdateStoreSocialLinkDto } from "./dto/update-store_social_link.dto";
import { InjectModel } from "@nestjs/sequelize";
import { StoreSocialLink } from "./models/store_social_link.model";

@Injectable()
export class StoreSocialLinkService {
  constructor(
    @InjectModel(StoreSocialLink)
    private storeStoreSocialLinkModel: typeof StoreSocialLink
  ) {}

  async create(createStoreSocialLinkDto: CreateStoreSocialLinkDto) {
    return await this.storeStoreSocialLinkModel.create(
      createStoreSocialLinkDto
    );
  }

  async findAll() {
    return await this.storeStoreSocialLinkModel.findAll();
  }

  async findOne(id: number) {
    return await this.storeStoreSocialLinkModel.findByPk(id);
  }

  async update(id: number, updateStoreSocialLinkDto: UpdateStoreSocialLinkDto) {
    const storeStoreSocialLink =
      await this.storeStoreSocialLinkModel.findByPk(id);
    storeStoreSocialLink?.update(updateStoreSocialLinkDto);
    return storeStoreSocialLink;
  }

  async remove(id: number) {
    const storeStoreSocialLink =
      await this.storeStoreSocialLinkModel.findByPk(id);
    storeStoreSocialLink?.destroy();
    return { message: "Store social link has been destroyed successfully" };
  }
}
