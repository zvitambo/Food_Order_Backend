import { EditVandorInputs } from './../dto';
import { FindVandor } from './AdminController';
import {
  ValidatePassword,
  GenerateSignature,
} from "./../utility/PasswordUtility";
import { RequestHandler } from "express";
import { VandorLoginInputs, CreateFoodInputs } from "../dto/";
import { Food, Order } from '../models';
import { Request } from 'twilio/lib/webhooks/webhooks';

export const VandorLogin: RequestHandler = async(req, res, next) => {
    const {email, password} = <VandorLoginInputs>req.body;

    const existingvandor = await FindVandor("", email);
    if(!existingvandor) return res.json("Email or Password is invalid");

    const validCredentials = await ValidatePassword(password, existingvandor.password, existingvandor.salt);
    if (validCredentials) {
        const signature = GenerateSignature({
          _id: existingvandor.id,
          name: existingvandor.name,
          foodTypes: existingvandor.foodType,
          email: existingvandor.email
        });
        return res.status(200).json(signature);
    }
    return res.json("Email or Password is invalid");

}


export const GetVandorProfile: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (user) {
    const existingVandor = await FindVandor(user._id);
    return res.json(existingVandor);
  }
   return res.json({"message": "vandor information not found"});
};

export const UpdateVandorProfile: RequestHandler = async (req, res, next) => {

   const { address,  phone,  name,  foodType } = <EditVandorInputs>req.body;
   const user = req.user;
   if (user) {
     const existingVandor = await FindVandor(user._id);
     if (existingVandor) {
       existingVandor.phone = phone;
       existingVandor.name = name;
       existingVandor.address = address;
       existingVandor.foodType = foodType;

       const updatedVandor = await existingVandor.save();
       return res.json(updatedVandor);
     }
   }
   return res.json({ message: "vandor information not found" });
};


export const updateVandorCoverImage: RequestHandler = async (req, res, next) => {
   const user = req.user;
   if (user) {
     
     const vandor = await FindVandor(user._id);

     if (vandor !== null) {
       const files = req.files as [Express.Multer.File];       
       const images = files.map((file: Express.Multer.File) => file.filename);
       vandor.coverImages.push(...images);
       const result = await vandor.save();

       return res.status(201).json(result);
     }
   }
   return res.json({ message: "failed to add cover image" });
}



export const UpdateVandorService: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (user) {
    const existingVandor = await FindVandor(user._id);
    if (existingVandor) {
      existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
      const updatedVandor = await existingVandor.save();
      return res.json(updatedVandor);
    }
  }
   return res.json({"message": "vandor information not found"});
}; 


export const AddFood: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (user) {

    const {
      name,
      description,
      foodType,
      category,
      readyTime,
      price,
    } = <CreateFoodInputs>req.body;

    const vandor = await FindVandor(user._id);

    if(vandor !== null){

      const files = req.files as [Express.Multer.File];
      console.log("files - ", files);
      const images = files.map((file: Express.Multer.File) => file.filename)
      console.log("images - ", images);

      const createdFood = await Food.create({
        vandorId: vandor._id,
        name: name,
        description: description,
        foodType: foodType,
        category: category,
        readyTime: readyTime,
        price: price,
        rating: 0,
        images: images,
      });

      vandor.foods.push(createdFood);
      const result = await vandor.save();
      
      return res.status(201).json(result);
    
    }
    
  }
  return res.json({ message: "failed to add food " });
}; 


export const GetFood: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (user) {
    const foods = await Food.find({vandorId: user._id});
      if (foods) return res.status(200).json(foods)
  }
  return res.status(400).json({ message: "failed to get food listing " });
}; 



// Orders

export const GetCurrentOrders: RequestHandler = async(req, res, next) => {

  const vendor = req.user;

  if (vendor) {
    const orders = await Order.find({ vandorId: vendor._id }).populate(
      "items.food"
    );

    if (orders) return res.status(200).json(orders);

    return res.status(400).json({ message: "No orders available" });

  }

  return res.status(400).json({ message: "failed to find vendor profile " });

}; 

export const GetOrderDetails: RequestHandler = async (req, res, next) => {

   const orderId  = req.params.id;

   if (orderId) {
     const order = await Order.findById(orderId).populate("items.food");

     if (order) return res.status(200).json(order);

     return res.status(400).json({ message: "Order not found" });
   }

   return res.status(400).json({ message: "Invalid order request" });
}; 

export const ProcessOrder: RequestHandler = async (req, res, next) => {


   const orderId = req.params.id;

   const { remarks, status, time } = req.body;

   if (orderId) {
     const order = await Order.findById(orderId).populate("items.food"); 

     if (order)
     {
      order.orderStatus = status;
      order.remarks = remarks;
      if (time) order.readyTime = time;

      const orderResult = await order.save();
      if (orderResult) return res.status(200).json(orderResult);
     }

     return res.status(400).json({ message: "Order not found" });
   }

   return res.status(400).json({ message: "Invalid order request" });
}; 


export const GetOffers: RequestHandler = (req, res, next) => {};

export const AddOffer: RequestHandler = (req, res, next) => {};

export const EditOffer: RequestHandler = (req, res, next) => {};