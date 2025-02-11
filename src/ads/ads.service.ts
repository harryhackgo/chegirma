import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Ads } from "./models/ad.model";
import { CreateAdsDto } from "./dto/create-ad.dto";
import { UpdateAdsDto } from "./dto/update-ad.dto";

@Injectable()
export class AdsService {
  constructor(@InjectModel(Ads) private adsModel: typeof Ads) {}

  async create(createAdsDto: CreateAdsDto) {
    const newAd = await this.adsModel.create(createAdsDto);
    return newAd;
  }

  async findAll() {
    const ads = await this.adsModel.findAll();
    if (!ads.length) throw new BadRequestException("No ads found");
    return ads;
  }

  async findOne(id: number) {
    const ad = await this.adsModel.findByPk(id);
    if (!ad) throw new BadRequestException("Ad not found");
    return ad;
  }

  async update(id: number, updateAdsDto: UpdateAdsDto) {
    const ad = await this.adsModel.findByPk(id);
    if (!ad) throw new BadRequestException("Ad not found");
    return await ad.update(updateAdsDto);
  }

  async remove(id: number) {
    const ad = await this.adsModel.findByPk(id);
    if (!ad) throw new BadRequestException("Ad not found");
    await ad.destroy();
    return { message: "Ad has been deleted successfully" };
  }
}
