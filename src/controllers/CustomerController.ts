import { DeliveryUserLogin } from './DeliveryController';
import { TransactionDoc } from './../models/Transaction';

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
  OrderInputs,
  CartItem
} from "./../dto";
import { RequestHandler, Router } from "express";
import {validate} from "class-validator";
import { plainToClass } from "class-transformer";
import { Customer, Food, Offer, Order, Vandor, DeliveryUser } from '../models';
import { Transaction } from "../models/Transaction";


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
       orders: []
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


//Cart

export const AddToCart: RequestHandler = async(req, res, next) => {

  const customer = req.user;

  if (customer) 
  {  

    const profile = await Customer.findById(customer._id).populate("cart.food");

    let cartItems = Array();

    const { _id, unit } = <CartItem>req.body;

    const food = await Food.findById(_id);

    if (food)
    {

      if (profile !== null) {

         // Check for cart items 
        cartItems = profile.cart;

        if (cartItems.length > 0 ) {

          //check and update items 
          let existingFoodItem = cartItems.filter( item => item.food._id.toString() === _id);

          if (existingFoodItem.length > 0) {

            const index = cartItems.indexOf(existingFoodItem[0]);

            if (unit > 0)
            {
             cartItems[index] = { food, unit };
            }
            else
            {
              cartItems.splice(index, 1);

            }
          } else {
            cartItems.push({ food, unit });
          }
        } else {

          //add new itemn to cart
          cartItems.push({ food, unit });
        }

        if (cartItems) {
          profile.cart = cartItems as any;
          const cartResult = await profile.save();
          return res.status(201).json(cartResult.cart);
        }
        
      }
    }
    
    return res
      .status(400)
      .json({ message: "Failed to update customer profile" });
  }

  return res.status(400).json({message:"Customer information not found"});
};

export const GetCart: RequestHandler = async (req, res, next) => {

  const customer = req.user;

  if (customer) {

    const profile = await Customer.findById(customer._id).populate("cart.food");

    if (profile) return res.status(200).json(profile.cart);

    return res.status(400).json({ message: "Customer profile not found" });
    
  }

  return res.status(400).json({ message: "Customer information not found" });
};

export const DeleteCart: RequestHandler = async (req, res, next) => {

   const customer = req.user;

   if (customer) {
     const profile = await Customer.findById(customer._id).populate(
       "cart.food"
     );

     if (profile) 
     {
        profile.cart = [] as any;
        const profileResult = await profile.save();
        return res.status(200).json(profileResult);
     }

     return res.status(400).json({ message: "Customer profile not found" });
   }

   return res.status(400).json({ message: "Customer information not found" });
};

//Order

const assignOrderForDelivery = async(orderId: string, vendorId: string) => {
   const vendor = await Vandor.findById(vendorId);

   if (vendor) {

    const areaCode = vendor.pincode;
    const vendorLat = vendor.lat;
    const vendorng = vendor.lng;

    const deliveryUsers = await DeliveryUser.find({pincode: areaCode, verified: true, isAvailable: true});
    if (deliveryUsers){
       const currentOrder = await Order.findById(orderId);

       if (currentOrder){
          currentOrder.deliveryId = deliveryUsers[0]._id;
          await currentOrder.save();
       }
    }
 
   }
  }

const validateTransaction = async (transactionId: string) => {

  const currentTransaction = await Transaction.findById(transactionId);

  if (currentTransaction) {
    if (currentTransaction.status.toLowerCase() !== "failed")
      return { status: true, currentTransaction: currentTransaction };
    return { status: false, currentTransaction: currentTransaction };
  }
  return { status: false, currentTransaction };
}; 



export const CreateOrder: RequestHandler = async(req, res, next) => {
  //grab current logined user
  const customer = req.user;
  const {amount, items, transactionId}= <OrderInputs>req.body;

  if (customer){

    const { status, currentTransaction } =
      await validateTransaction(transactionId);

    if (!status) return res.status(400).json({message: "Error creating order"});

    //create an orderid 
    const orderId = `${Math.floor(Math.random()*89999) + 1000}`;

    const profile = await Customer.findById(customer._id);
    

    //Grab order items from request [{_id: xx, units: xx}]
    //const cart  = <[CartItem]>req.body;

    let cartItems = Array();
    
    let netAmount = 0.0;

    let vendorId = ""; 

    const foods = await Food.find()
      .where("_id")
      .in(items.map((item) => item._id))
      .exec();
    
    foods.map(food => {
        items.map(({ _id, unit }) => {
          if ((food._id = _id)) {
            vendorId = food.vandorId;
            netAmount += food.price * unit;
            cartItems.push({ food, unit });
          }
        });
    });
    

    //Create Order with Order descriptions
    if (cartItems.length > 0 ) {

      const currentOrder = await Order.create({
        orderID: orderId,
        vandorId: vendorId,
        items: cartItems,
        totalAmount: netAmount,
        paidAmount: amount,
        orderDate: new Date(),
        // paidThrough: "COD",
        // paymentResponse: "",
        orderStatus: "Waiting",
        // deliveryId: "",
        // appliedOffers: false,
        offerId: null,
        remarks: "",
        readyTime: 45,
      });

       if (currentTransaction) {
          currentTransaction.vandorId = vendorId;
          currentTransaction.orderId = orderId;
          currentTransaction.status = "CONFIRMED";
          await currentTransaction.save();
        }
        await assignOrderForDelivery(currentOrder._id, vendorId); 
     

      if (currentOrder && profile) {
        profile.cart = [] as any;
        profile.orders.push(currentOrder);
        await profile.save();
        return res.status(201).json(currentOrder);
      }
    }

  }

  return res.status(400).json({ message: "Customer information not found" });

}; 

export const GetOrders: RequestHandler = async(req, res, next) => {

  const customer = req.user;

  if (customer){

    const profile = await Customer.findById(customer._id).populate("orders");

    if(profile) return res.status(200).json(profile.orders);

    return res.status(400).json({ message: "Customer information not found" });

  }

  return res.status(400).json({ message: "Customer information not found" });
}; 

export const GetOrderById: RequestHandler = async(req, res, next) => {

  const orderId = req.params.id;
 
  const order = await Order.findById(orderId).populate("items.food");

  
  if (order) return res.status(200).json(order);

  return res.status(400).json({ message: "Order information not found" });


}; 


//Offers 

export const VerifyOffer: RequestHandler = async(req, res, next) => {
  const user = req.user;
  const offerId = req.params.id;

  if (user)
  {
    const appliedOffer = await Offer.findById(user._id);
    
    if(appliedOffer){

      if (appliedOffer.promoType === "USER")
      {

      }
      else 
      {
        if (appliedOffer.isActive) 
        return res.status(200).json({ message: "offer is valid", offer: appliedOffer });
      }
    }
    return res.status(400).json({ message: "offer not found" });


  }

  return res.status(400).json({message: "Unable to verify the offer"});
};


//Payment


export const CreatePayment: RequestHandler = async(req, res, next) => {

  const customer = req.user;
  const {amount, paymentMode, offerId} = req.body;
  let payableAmount = Number(amount);
  if (customer) {
    if (offerId) {
      const appliedOffer = await Offer.findById(offerId);
      if (appliedOffer?.isActive)
        payableAmount = payableAmount - appliedOffer.offerAmount;
    }

    const transaction = await Transaction.create({
      customer: customer._id,
      vandorId: "",
      orderId: "",
      orderValue: payableAmount,
      offerUsed: offerId || "NA",
      status: "OPEN", // Failed // Success
      paymentMode: paymentMode,
      paymentResponse: "Payment is Cash on Delivery",
    });
    return res.status(201).json(transaction);
  }
  return res.status(400).json({message: "User not found"});
};
