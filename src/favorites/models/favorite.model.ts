import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "../../users/models/user.model";
import { Discounts } from "../../discounts/models/discount.model";

interface IFavouriteCreationAttr {
  userId: number;
  discountId: number;
}

@Table({ tableName: "favourites" })
export class Favourite extends Model<Favourite, IFavouriteCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Discounts)
  @Column({ type: DataType.BIGINT, allowNull: false })
  discountId: number;

  @BelongsTo(() => Discounts)
  discount: Discounts;
}
