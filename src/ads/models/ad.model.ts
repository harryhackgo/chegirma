import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IAdsCreationAttr {
  title: string;
  description: string;
  photo: string;
  start_date: Date;
  end_date: Date;
}

@Table({ tableName: "ads" })
export class Ads extends Model<Ads, IAdsCreationAttr> {
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
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  photo: string;

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
}
