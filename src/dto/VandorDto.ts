export interface CreateVandorInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  password: string;
  email: string;
}

export interface EditVandorInputs {
  phone: string;
  address: string;
  name: string;
  foodType: [string];
}


export interface VandorLoginInputs{
  email: string,
  password: string,
}

export interface VandorPayload {
  _id: string,
  name: string,
  foodTypes: [string], 
  email: string,
}