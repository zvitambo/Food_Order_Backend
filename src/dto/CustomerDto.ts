import {IsEmail, Length} from 'class-validator';


export class CreateCustomerInputs {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;
}


export class UserLoginInputs {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}


export class EditCustomerProfileInputs {
  @Length(6, 12)
  firstname: string;

  @Length(6, 12)
  lastname: string;

  @Length(6, 12)
  address: string;
}


export class CartItem {
  _id: string;
  unit: number;
}

export class OrderInputs {
  transactionId: string;
  amount: string;
  items: [CartItem]
}

export interface CustomerPayload {
  _id: string;
  verified: boolean;
  email: string;
} 


 