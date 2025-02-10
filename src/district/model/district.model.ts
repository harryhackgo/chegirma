import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Region } from "../../region/model/region.model";

interface IDistrictCreatingAttr {
  name: string;
  regionId: number;
}

@Table({ tableName: "district" })
export class District extends Model<District, IDistrictCreatingAttr> {
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

  @ForeignKey(() => Region)
  @Column({
    type: DataType.INTEGER,
    onDelete: "Restrict",
  })
  regionId: number;

  @BelongsTo(() => Region)
  region: Region;
}
