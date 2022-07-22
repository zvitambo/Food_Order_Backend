import { GenerateSalt, GeneratePassword } from './../utility/PasswordUtility';
import {RequestHandler} from 'express';
import {CreateVandorInput} from '../dto/';
import {Vandor} from '../models';
import { Transaction, DeliveryUser } from "../models";


export const FindVandor = async (id: string|undefined, email?: string) => {

  if (email) return Vandor.findOne({email: email});
  return Vandor.findById(id);
}


export const CreateVandor: RequestHandler = async (req, res, next)  => {

    const { name, ownerName,foodType,pincode, address, phone, password,email} = <CreateVandorInput>req.body;
    
    const existingvandor = await FindVandor("", email);
    
    if (existingvandor !== null) return res.json('Vandor Exists Already')

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
    
    const createdVandor = await Vandor.create({
        name: name,
        ownerName: ownerName,
        foodType: foodType,
        pincode: pincode,
        address: address,
        phone: phone,
        password: userPassword,
        email: email,
        salt: salt,
        serviceAvailable: false,
        coverImages: [],
        rating: 0,
        foods:[],
        lat: 0,
        lng: 0
      });

    res.status(201).json({vandor: createdVandor});
}

export const GetVandors: RequestHandler = async (req, res, next) => {
  const vandors = await Vandor.find();

  if (vandors) return res.json(vandors);
  return res.json({"message": "No vandors found"});
}


export const GetVandorByID: RequestHandler = async ( req, res, next) => {
  const id = req.params.id;
  const vandor = await FindVandor(id);
  if (vandor) return res.json(vandor);
  return res.status(400).json({ message: "Vandor not found" });
}

export const GetTransactions: RequestHandler = async ( req, res, next) => {
  const transactions = await Transaction.find();
  if (transactions) return res.status(200).json(transactions);
  return res.status(400).json({ message: "Transactions not found" });
}


export const GetTransactionByID: RequestHandler = async (req, res, next) => {
  const id = req.params.id;
  const transaction = await Transaction.findById(id);
  if (transaction) return res.status(200).json(transaction);
  return res.status(400).json({ message: "Transaction not found" });
};



export const VerifyDeliveryUser: RequestHandler = async (
  req,
  res,
  next
) => {
  
  const { _id, status } = req.body;

  if (_id) {
    const profile = await DeliveryUser.findById(_id);

    if (profile) {
      profile.verified = status;     
      const updatedProfile = await profile.save();

      return res.status(200).json(updatedProfile);
    }
    return res
      .status(400)
      .json({ message: "Unable to verify delivery User" });
  }
  return res.status(400).json({ message: "Unable to verify delivery User" });
};



export const GetDeliveryUsers: RequestHandler = async (req, res, next) => {
 

 
    const deliveryUsers = await DeliveryUser.find();

    if (deliveryUsers) {     

      return res.status(200).json({ deliveryUsers: deliveryUsers });
    }
    
 
  return res.status(400).json({ message: "Unable to get delivery Users" });
};