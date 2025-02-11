import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Photo } from "./models/photo.model";
import { CreatePhotoDto } from "./dto/create-photo.dto";
import { UpdatePhotoDto } from "./dto/update-photo.dto";
import { Discounts } from "../discounts/models/discount.model";

@Injectable()
export class PhotoService {
  constructor(@InjectModel(Photo) private photoModel: typeof Photo) {}

  async create(createPhotoDto: CreatePhotoDto) {
    const newPhoto = await this.photoModel.create(createPhotoDto);
    return newPhoto;
  }

  async findAll() {
    const photos = await this.photoModel.findAll({
      include: [Discounts],
    });
    if (!photos.length) throw new BadRequestException("No photos found");
    return photos;
  }

  async findOne(id: number) {
    const photo = await this.photoModel.findByPk(id, {
      include: [Discounts],
    });
    if (!photo) throw new BadRequestException("Photo not found");
    return photo;
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto) {
    const photo = await this.photoModel.findByPk(id);
    if (!photo) throw new BadRequestException("Photo not found");
    return await photo.update(updatePhotoDto);
  }

  async remove(id: number) {
    const photo = await this.photoModel.findByPk(id);
    if (!photo) throw new BadRequestException("Photo not found");
    await photo.destroy();
    return { message: "Photo has been removed successfully" };
  }
}
