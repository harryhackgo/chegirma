import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { StoreSubscribe } from "./models/store_subscribe.model";
import { CreateStoreSubscribeDto } from "./dto/create-store_subscribe.dto";
import { UpdateStoreSubscribeDto } from "./dto/update-store_subscribe.dto";
import { User } from "../users/models/user.model";
import { Store } from "../store/models/store.model";

@Injectable()
export class StoreSubscribeService {
  constructor(
    @InjectModel(StoreSubscribe)
    private storeSubscribeModel: typeof StoreSubscribe
  ) {}

  async create(createStoreSubscribeDto: CreateStoreSubscribeDto) {
    const newSubscription = await this.storeSubscribeModel.create(
      createStoreSubscribeDto
    );
    return newSubscription;
  }

  async findAll() {
    const subscriptions = await this.storeSubscribeModel.findAll({
      include: [User, Store],
    });
    if (!subscriptions.length)
      throw new BadRequestException("No subscriptions found");
    return subscriptions;
  }

  async findOne(id: number) {
    const subscription = await this.storeSubscribeModel.findByPk(id, {
      include: [User, Store],
    });
    if (!subscription) throw new BadRequestException("Subscription not found");
    return subscription;
  }

  async update(id: number, updateStoreSubscribeDto: UpdateStoreSubscribeDto) {
    const subscription = await this.storeSubscribeModel.findByPk(id);
    if (!subscription) throw new BadRequestException("Subscription not found");
    return await subscription.update(updateStoreSubscribeDto);
  }

  async remove(id: number) {
    const subscription = await this.storeSubscribeModel.findByPk(id);
    if (!subscription) throw new BadRequestException("Subscription not found");
    await subscription.destroy();
    return { message: "Subscription has been removed successfully" };
  }
}
