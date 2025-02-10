import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

interface IDiscountTypeCreationAttr {
  name: string;
  desc?: string;
}

@Table({ tableName: "discount_type" })
export class DiscountType extends Model<
  DiscountType,
  IDiscountTypeCreationAttr
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  desc: string;
}
