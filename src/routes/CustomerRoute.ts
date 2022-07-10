
import {
  CustomerSignUp,
  CustomerLogin,
  CustomerVerify,
  RequestOtp,
  GetCustomerProfile,
  EditCustomerProfile,
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


export {router as CustomerRoute};