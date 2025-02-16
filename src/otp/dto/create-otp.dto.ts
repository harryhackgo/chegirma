export class CreateOtpDto {
  id: string;
  phone_number: string;
  otp: string;
  expiration_time: Date;
}
