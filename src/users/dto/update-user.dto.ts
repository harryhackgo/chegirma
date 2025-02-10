import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsOptional, IsPhoneNumber, IsString, IsEmail } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber("UZ")
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
