import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Reviews } from "./models/review.model";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { User } from "../users/models/user.model";
import { Discounts } from "../discounts/models/discount.model";

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Reviews) private reviewsModel: typeof Reviews) {}

  async create(createReviewDto: CreateReviewDto) {
    const newReview = await this.reviewsModel.create(createReviewDto);
    return newReview;
  }

  async findAll() {
    const reviews = await this.reviewsModel.findAll({
      include: [User, Discounts],
    });
    if (!reviews.length) throw new BadRequestException("No reviews found");
    return reviews;
  }

  async findOne(id: number) {
    const review = await this.reviewsModel.findByPk(id, {
      include: [User, Discounts],
    });
    if (!review) throw new BadRequestException("Review not found");
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewsModel.findByPk(id);
    if (!review) throw new BadRequestException("Review not found");
    return await review.update(updateReviewDto);
  }

  async remove(id: number) {
    const review = await this.reviewsModel.findByPk(id);
    if (!review) throw new BadRequestException("Review not found");
    await review.destroy();
    return { message: "Review has been removed successfully" };
  }
}
