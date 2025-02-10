import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateDiscountTypeDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  desc: string;
}
