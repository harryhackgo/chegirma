import { ApiProperty } from "@nestjs/swagger";
import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

interface IUserCreatingAttr {
  name: string;
  phone: string;
  email: string;
  hashed_password: string;
  activation_link: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, IUserCreatingAttr> {
  @ApiProperty({
    example: 1,
    description: "User's ID",
  })
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING(20), unique: true, allowNull: false })
  phone: string;

  @Column({ type: DataType.STRING(30), unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING })
  hashed_password: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_active: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_owner: boolean;

  @Column({ type: DataType.STRING })
  hashed_refresh_token: string | null;

  @Column({ type: DataType.STRING })
  activation_link: string;
}
