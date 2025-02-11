import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
} from "sequelize-typescript";
import { Discounts } from "../../discounts/models/discount.model";

interface IPhotoCreationAttr {
  url: string;
  discount_id: number;
}

@Table({ tableName: "photo" })
export class Photo extends Model<Photo, IPhotoCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @ForeignKey(() => Discounts)
  @Column({ type: DataType.BIGINT, allowNull: false })
  discount_id: number;

  @BelongsTo(() => Discounts)
  discount: Discounts;
}
