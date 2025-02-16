import { IsPhoneNumber } from "class-validator";

export class PhoneDto {
  @IsPhoneNumber("UZ")
  phone_number: string;
}
