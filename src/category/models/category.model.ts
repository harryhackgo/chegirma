import { DataTypes } from "sequelize";
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";

interface ICategoryCreationAttr {
  name: string;
  desc?: string;
  parentId?: number;
}
@Table({ tableName: "category" })
export class Category extends Model<Category, ICategoryCreationAttr> {
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  desc: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
  })
  parentId: number;

  @BelongsTo(() => Category, { foreignKey: "parentId", as: "parent" })
  parentCategory: Category;

  @HasMany(() => Category, { foreignKey: "parentId", as: "subcategories" })
  subcategories: Category[];
}
