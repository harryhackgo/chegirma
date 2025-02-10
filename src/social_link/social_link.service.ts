import { Injectable } from "@nestjs/common";
import { CreateSocialLinkDto } from "./dto/create-social_link.dto";
import { UpdateSocialLinkDto } from "./dto/update-social_link.dto";
import { InjectModel } from "@nestjs/sequelize";
import { SocialLink } from "./models/social_link.entity";

@Injectable()
export class SocialLinkService {
  constructor(
    @InjectModel(SocialLink) private socialLinkModel: typeof SocialLink
  ) {}

  async create(createSocialLinkDto: CreateSocialLinkDto) {
    return await this.socialLinkModel.create(createSocialLinkDto);
  }

  async findAll() {
    return await this.socialLinkModel.findAll();
  }

  async findOne(id: number) {
    return await this.socialLinkModel.findByPk(id);
  }

  async update(id: number, updateSocialLinkDto: UpdateSocialLinkDto) {
    const socialLink = await this.socialLinkModel.findByPk(id);
    socialLink?.update(updateSocialLinkDto);
    return socialLink;
  }

  async remove(id: number) {
    const socialLink = await this.socialLinkModel.findByPk(id);
    socialLink?.destroy();
    return { message: "Social link has been destroyed successfully" };
  }
}
