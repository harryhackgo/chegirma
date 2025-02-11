import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Store } from "../../store/models/store.model";
import { Category } from "../../category/models/category.model";
import { DiscountType } from "../../discount_type/models/discount_type.entity";
import { Photo } from "../../photo/models/photo.model";
import { Reviews } from "../../reviews/models/review.model";
import { Favourite } from "../../favorites/models/favorite.model";

interface IDiscountCreationAttr {
  store_id: number;
  title: string;
  description: string;
  discount_percent: number;
  start_date: Date;
  end_date: Date;
  categoryId: number;
  discount_value: number;
  special_link: string;
  is_active: boolean;
  discountTypeId: number;
}

@Table({ tableName: "discounts" })
export class Discounts extends Model<Discounts, IDiscountCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Store)
  @Column({ type: DataType.BIGINT, allowNull: false })
  store_id: number;

  @BelongsTo(() => Store)
  store: Store;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  discount_percent: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  end_date: Date;

  @ForeignKey(() => Category)
  @Column({ type: DataType.BIGINT, allowNull: false })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  discount_value: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  special_link: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;

  @ForeignKey(() => DiscountType)
  @Column({ type: DataType.BIGINT, allowNull: false })
  discountTypeId: number;

  @BelongsTo(() => DiscountType)
  discountType: DiscountType;

  @HasMany(() => Photo)
  photos: Photo[];

  @HasMany(() => Reviews)
  reviews: Reviews[];

  @HasMany(() => Favourite)
  favourites: Favourite[];
}
