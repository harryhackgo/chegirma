import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "../../users/models/user.model";
import { District } from "../../district/model/district.model";
import { Region } from "../../region/model/region.model";
import { StoreSocialLink } from "../../store_social_link/models/store_social_link.model";

interface IStoreCreationAttr {
  name: string;
  location: string;
  phone: string;
  ownerId: number;
  StoreSocialLinkId: number;
  since: number;
  districtId: number;
  regionId: number;
}

@Table({ tableName: "store", timestamps: true })
export class Store extends Model<Store, IStoreCreationAttr> {
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  phone: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  ownerId: number;

  @BelongsTo(() => User)
  owner: User;

  @ForeignKey(() => StoreSocialLink)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  StoreSocialLinkId: number;

  @BelongsTo(() => StoreSocialLink)
  storeSocialLink: StoreSocialLink;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  since: number;

  @ForeignKey(() => District)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  districtId: number;

  @BelongsTo(() => District)
  district: District;

  @ForeignKey(() => Region)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  regionId: number;

  @BelongsTo(() => Region)
  region: Region;
}
