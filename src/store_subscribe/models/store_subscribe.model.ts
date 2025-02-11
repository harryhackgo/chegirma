import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "../../users/models/user.model";
import { Store } from "../../store/models/store.model";

interface IStoreSubscribeCreationAttr {
  userId: number;
  storeId: number;
}

@Table({ tableName: "store_subscribe" })
export class StoreSubscribe extends Model<
  StoreSubscribe,
  IStoreSubscribeCreationAttr
> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Store)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  storeId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Store)
  store: Store;
}
