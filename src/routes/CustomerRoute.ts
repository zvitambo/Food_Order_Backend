
import {
  CustomerSignUp,
  CustomerLogin,
  CustomerVerify,
  RequestOtp,
  GetCustomerProfile,
  EditCustomerProfile,
  CreateOrder,
  GetOrders,
  GetOrderById,
  AddToCart,
  GetCart,
  DeleteCart,
  VerifyOffer,
  CreatePayment,
} from "./../controllers";
import { Authenticate } from "./../middlewares";
import express from "express";

const router = express.Router();

router.post("/signup", CustomerSignUp);

router.post("/login", CustomerLogin);

// Authenticate

router.use(Authenticate);

router.patch("/verify", CustomerVerify);

router.get("/otp", RequestOtp);

router.get("/profile", GetCustomerProfile);

router.patch("/profile", EditCustomerProfile);



//Cart
router.post('/cart', AddToCart);
router.get("/cart", GetCart);
router.delete("/cart", DeleteCart);


//Apply Offers
router.get("/offer/verify/:id", VerifyOffer);


//Payment
router.post("/create-payment", CreatePayment);





//Order

router.post("/create-order", CreateOrder);
router.get("/order", GetOrders);
router.get("/order/:id", GetOrderById);



export {router as CustomerRoute};