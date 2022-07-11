
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
} from "./../dto";
import { RequestHandler } from "express";
import {validate} from "class-validator";
import { plainToClass } from "class-transformer";
import { Customer, Food, Order } from '../models';


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


export const CreateOrder: RequestHandler = async(req, res, next) => {
  //grab current logined user
  const customer = req.user;

  if (customer){

    //create an orderid 
    const orderId = `${Math.floor(Math.random()*89999) + 1000}`;

    const profile = await Customer.findById(customer._id);
    

    //Grab order items from request [{_id: xx, units: xx}]
    const cart = <[OrderInputs]>req.body;

    let cartItems = Array();
    
    let netAmount = 0.0;

    const foods =  await Food.find().where('_id').in(cart.map(item => item._id)).exec();
    
    foods.map(food => {
        cart.map(({_id, unit}) => {
          if (food._id = _id){
            netAmount += food.price * unit;
            cartItems.push({food, unit});
          }
        })
    });
    

    //Create Order with Order descriptions
    if (cartItems.length > 0 ) {

      const currentOrder = await Order.create({
        orderID: orderId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: 'COD',
        paymentResponse: '', 
        orderStatus: 'Waiting',
      });

      if (currentOrder && profile) {
        profile?.orders.push(currentOrder);
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
