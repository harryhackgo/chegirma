import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { District } from "../../district/model/district.model";

interface IRegionCreatingAttr {
  name: string;
}

@Table({ tableName: "region" })
export class Region extends Model<Region, IRegionCreatingAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(50),
  })
  name: string;

  @HasMany(() => District)
  district: District[];
}
