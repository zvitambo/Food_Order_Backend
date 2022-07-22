import express, {Request, Response, NextFunction} from 'express';
import {
  CreateVandor,
  GetVandors,
  GetVandorByID,
  GetTransactions,
  GetTransactionByID,
  GetDeliveryUsers,
  VerifyDeliveryUser,
} from "../controllers";

const router = express.Router();


router.post('/vandor', CreateVandor)
router.get('/vandors', GetVandors)
router.get('/vandor/:id', GetVandorByID)

router.get("/transactions", GetTransactions);

router.get("/transaction/:id", GetTransactionByID);

router.put("/delivery/verify", VerifyDeliveryUser);

router.get("/delivery/users", GetDeliveryUsers);

router.get("/", (req: Request, res: Response, next: NextFunction)=>{
    return res.json("Hello AdminRouter");
} )


export {router as AdminRoute};