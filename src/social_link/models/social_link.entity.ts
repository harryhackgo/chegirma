import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { StoreSocialLink } from "../../store_social_link/models/store_social_link.model";

interface ISocialLinkCreationAttr {
  name: string;
  icon?: string;
  storeSocialLinkId: number;
}

@Table({ tableName: "social_link" })
export class SocialLink extends Model<SocialLink, ISocialLinkCreationAttr> {
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

  @Column({
    type: DataType.STRING,
  })
  icon: string;

  @ForeignKey(() => StoreSocialLink)
  @Column({
    type: DataType.INTEGER,
  })
  storeSocialLinkId: number;

  @BelongsTo(() => StoreSocialLink)
  storeSocialLink: StoreSocialLink;
}
