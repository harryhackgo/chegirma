import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "../../users/models/user.model";
import { Discounts } from "../../discounts/models/discount.model";

interface IReviewsCreationAttr {
  discountId: number;
  userId: number;
  text: string;
  rating: number;
  photo?: string;
}

@Table({ tableName: "reviews" })
export class Reviews extends Model<Reviews, IReviewsCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Discounts)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  discountId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rating: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  photo: string;

  @BelongsTo(() => Discounts)
  discount: Discounts;

  @BelongsTo(() => User)
  user: User;
}
