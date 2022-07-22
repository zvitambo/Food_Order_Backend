import {
  DeliveryUserSignUp,
  DeliveryUserLogin,
  GetDeliveryUserProfile,
  EditDeliveryUserProfile,
  UpdateDeliveryUserStatus,
  
} from "./../controllers";
import { Authenticate } from "./../middlewares";
import express from "express";

const router = express.Router();

router.post("/signup", DeliveryUserSignUp);

router.post("/login", DeliveryUserLogin);

// Authenticate

router.use(Authenticate);


router.put("/change-status", UpdateDeliveryUserStatus);

router.get("/profile", GetDeliveryUserProfile);

router.patch("/profile", EditDeliveryUserProfile);



export { router as DeliveryRoute };
