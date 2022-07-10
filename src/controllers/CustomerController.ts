
import {
  GenerateSalt,
  GeneratePassword,
  GenerateSignature,
  onRequestOtp,
  GenerateOtp,
  ValidatePassword,
} from "./../utility";
import {
  CreateCustomerInputs,
  UserLoginInputs,
  EditCustomerProfileInputs,
} from "./../dto";
import { RequestHandler } from "express";
import {validate} from "class-validator";
import { plainToClass } from "class-transformer";
import { Customer } from '../models';


export const CustomerSignUp: RequestHandler = async (req, res, next) => {

   const customerInputs = plainToClass(CreateCustomerInputs, req.body);
   const inputErrors = await validate(customerInputs, { validationError: {target: true}});

   if (inputErrors.length > 0) return res.status(400).json(inputErrors);

   const {email, phone, password} = customerInputs
   const salt = await GenerateSalt();
   const userPassword = await GeneratePassword(password, salt);


   const { otp, expiry } = GenerateOtp();

   const existingCustomer = await Customer.findOne({email: email});
   if (existingCustomer) return res.status(400).json({message: "Customer exists"});
     const result = await Customer.create({
       firstName: "",
       lastName: "",
       address: "",
       phone: phone,
       password: userPassword,
       email: email,
       salt: salt,
       verified: false,
       otp: otp,
       otp_expiry: expiry,
       lat: 0,
       lng: 0,
     });


   if (result){
   //send the otp to customer
   await onRequestOtp(otp, phone);

   //generate the signature 

   const signature = GenerateSignature({_id: result._id, email: result.email, verified: result.verified});
   return res
     .status(201)
     .json({
       signature: signature,
       email: result.email,
       verified: result.verified,
     });
   }

   return res.status(400).json({message: "failed to signup"});
}

export const CustomerLogin: RequestHandler = async (req, res, next) => {

  const loginInputs = plainToClass(UserLoginInputs, req.body);
  const inputErrors = await validate(loginInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) return res.status(400).json(inputErrors);

  const { email,  password } = loginInputs;

  const customer = await Customer.findOne({email: email});

  if(customer){


    const validated = await ValidatePassword(password, customer.password, customer.salt);

    if (validated) {

      const signature = GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });
      return res.status(201).json({
        signature: signature,
        email: customer.email,
        verified: customer.verified,
      });

    }
     
  }


  return res.status(400).json({ message: "failed to signup" });
};

export const CustomerVerify: RequestHandler = async (req, res, next) => {
      const {otp} = req.body;
      const customer = req.user;

      if (customer) {

      const profile = await Customer.findById(customer?._id)

      if (profile) {

         if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date() ){

            profile.verified = true;

            const updatedCustomerResponse = await profile.save();

              const signature = GenerateSignature({
                _id: updatedCustomerResponse._id,
                email: updatedCustomerResponse.email,
                verified: updatedCustomerResponse.verified,
              });
              return res.status(201).json({
                signature: signature,
                email: updatedCustomerResponse.email,
                verified: updatedCustomerResponse.verified,
              });

          }
        }

      }

      return res.status(400).json({ message: "Error with otp validation" });

};

export const RequestOtp: RequestHandler = async (req, res, next) => {
  const customer = req.user;

  if (customer){

    const profile = await Customer.findById(customer._id);

    if (profile){
      const {otp, expiry } = GenerateOtp();
      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();

      await onRequestOtp(profile.otp, profile.phone);
      return res.status(200).json({ message: "Otp sent to you registered number" });
    }
     
  }
  return res.status(400).json({ message: "Error with Otp request" });
};

export const GetCustomerProfile: RequestHandler = async (req, res, next) => {
    const customer = req.user;
    

    if (customer) {
      const profile = await Customer.findById(customer._id);

      if (profile) {        
        return res.status(200).json(profile);
      }
      return res
        .status(400)
        .json({ message: "Customer information not found" });
    }
    return res.status(400).json({ message: "Customer information not found" });
};

export const EditCustomerProfile: RequestHandler = async (req, res, next) => {

  const customer = req.user;
  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);
  const profileInputErrors = await validate(profileInputs, { validationError: {target: true} });
  if (profileInputErrors.length > 0) return res.status(400).json(profileInputErrors);

  const {firstname, lastname, address} = profileInputs;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile){
      profile.firstName = firstname;
      profile.lastName = lastname;
      profile.address = address;

      const result = await profile.save();
       return res
         .status(200)
         .json(result);
    }
    return res.status(400).json({ message: "Failed to update customer profile" });
  }
   return res.status(400).json({ message: "Customer information not found" });

};