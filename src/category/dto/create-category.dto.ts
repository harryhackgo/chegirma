import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  desc?: string;

  @IsNumber()
  @IsOptional()
  parentId?: number;
}
