import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IAddressCreationAttr {
  user_id: number | undefined;
  last_state: string;
}

@Table({ tableName: "address" })
export class Address extends Model<Address, IAddressCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.BIGINT,
  })
  user_id: number | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  last_state: string | undefined;
}
