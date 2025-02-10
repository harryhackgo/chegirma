import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import { SocialLink } from "../../social_link/models/social_link.entity";

interface IStoreSocialLinkCreationAttr {
  url: string;
  description: string;
}

@Table({ tableName: "store", timestamps: true })
export class StoreSocialLink extends Model<
  StoreSocialLink,
  IStoreSocialLinkCreationAttr
> {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @HasMany(() => SocialLink)
  socialLinks: SocialLink[];
}
