import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ICarCreationAttr {
  user_id: number | undefined;
  last_state: string;
}

@Table({ tableName: "car" })
export class Car extends Model<Car, ICarCreationAttr> {
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
  car_number: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  model: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  color: string | undefined;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  year: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  last_state: string | undefined;
}
