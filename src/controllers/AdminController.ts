import { GenerateSalt, GeneratePassword } from './../utility/PasswordUtility';
import {RequestHandler} from 'express';
import {CreateVandorInput} from '../dto/';
import {Vandor} from '../models';


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
        foods:[]
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
  return res.json({"message": "Vandor not found"});
}