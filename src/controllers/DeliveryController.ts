import { TransactionDoc } from "./../models/Transaction";

import {
  GenerateSalt,
  GeneratePassword,
  GenerateSignature,
  onRequestOtp,
  GenerateOtp,
  ValidatePassword,
} from "./../utility";
import {
  CreateDeliveryUserInputs,
  UserLoginInputs,
  EditCustomerProfileInputs,
  OrderInputs,
  CartItem,
} from "./../dto";
import { RequestHandler, Router } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { Customer, Food, Offer, Order, DeliveryUser } from "../models";
import { Transaction } from "../models/Transaction";

export const DeliveryUserSignUp: RequestHandler = async (req, res, next) => {
  const deliveryUserInputs = plainToClass(CreateDeliveryUserInputs, req.body);
  const inputErrors = await validate(deliveryUserInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) return res.status(400).json(inputErrors);

  const { email, phone, password, firstname, lastname, address, pincode } = deliveryUserInputs;
  const salt = await GenerateSalt();
  const deliveryUserPassword = await GeneratePassword(password, salt);



  const existingDeliveryUser = await DeliveryUser.findOne({ email: email });
  if (existingDeliveryUser)
    return res.status(400).json({ message: "DeliveryUser exists" });
  const result = await DeliveryUser.create({
    firstName: firstname,
    lastName: lastname,
    address: address,
    phone: phone,
    password: deliveryUserPassword,
    email: email,
    salt: salt,
    verified: false,
    lat: 0,
    lng: 0,
    isAvailable: false,
    pincode: pincode,
  });

  if (result) {
    //send the otp to customer
    

    //generate the signature

    const signature = GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });
    return res.status(201).json({
      signature: signature,
      email: result.email,
      verified: result.verified,
    });
  }

  return res.status(400).json({ message: "failed to signup" });
};

export const DeliveryUserLogin: RequestHandler = async (req, res, next) => {
  const loginInputs = plainToClass(UserLoginInputs, req.body);
  const inputErrors = await validate(loginInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) return res.status(400).json(inputErrors);

  const { email, password } = loginInputs;

  const deliveryUser = await DeliveryUser.findOne({ email: email });

  if (deliveryUser) {
    const validated = await ValidatePassword(
      password,
      deliveryUser.password,
      deliveryUser.salt
    );

    if (validated) {
      const signature = GenerateSignature({
        _id: deliveryUser._id,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      });
      return res.status(201).json({
        signature: signature,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      });
    }
  }

  return res.status(400).json({ message: "failed to signup" });
};



export const GetDeliveryUserProfile: RequestHandler = async (req, res, next) => {
  const deliveryUser = req.user;

  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      return res.status(200).json(profile);
    }
    return res
      .status(400)
      .json({ message: "delivery User information not found" });
  }
  return res
    .status(400)
    .json({ message: "deliveryvUser information not found" });
};

export const EditDeliveryUserProfile: RequestHandler = async (req, res, next) => {
  const deliveryUser = req.user;
  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);
  const profileInputErrors = await validate(profileInputs, {
    validationError: { target: true },
  });
  if (profileInputErrors.length > 0)
    return res.status(400).json(profileInputErrors);

  const { firstname, lastname, address } = profileInputs;

  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      profile.firstName = firstname;
      profile.lastName = lastname;
      profile.address = address;

      const result = await profile.save();
      return res.status(200).json(result);
    }
    return res
      .status(400)
      .json({ message: "Failed to update delivery user profile" });
  }
  return res
    .status(400)
    .json({ message: "delivery user information not found" });
};

export const UpdateDeliveryUserStatus: RequestHandler = async (
  req,
  res,
  next
) => {
const deliveryUser = req.user;
const { lat, lng } = req.body;

  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {

        profile.isAvailable = !profile.isAvailable;
         if (lat && lng) {
           profile.lat = lat;
           profile.lng = lng;
         }
         const updatedProfile = await profile.save();
         
         return res.status(200).json(updatedProfile);
    }
    return res
      .status(400)
      .json({ message: "delivery User information not updated" });
  }
  return res
    .status(400)
    .json({ message: "deliveryvUser information not updated" });
};