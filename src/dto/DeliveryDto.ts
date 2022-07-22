import { IsEmail, Length } from "class-validator";

export class CreateDeliveryUserInputs {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;

  @Length(7, 12)
  firstname: string;

  @Length(6, 12)
  lastname: string;

  @Length(7, 24)
  address: string;

  @Length(6, 12)
  pincode: string;
}

