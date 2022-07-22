import { AddFood, GetFood } from './../controllers';
import { Authenticate } from './../middlewares';
import {
  GetVandorProfile,
  UpdateVandorProfile,
  UpdateVandorService,
  updateVandorCoverImage,
  GetCurrentOrders,
  GetOrderDetails,
  ProcessOrder,
  EditOffer,
  AddOffer,
  GetOffers,
} from "./../controllers";
import express, { Request, Response, NextFunction } from "express";
import { VandorLogin } from '../controllers';
import multer from 'multer';

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname
    );
  },
}); 


const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", VandorLogin);

//router.use(Authenticate);
router.get("/profile", Authenticate,  GetVandorProfile);
router.patch("/profile", Authenticate, UpdateVandorProfile);
router.patch("/coverimage", images, Authenticate, updateVandorCoverImage);
router.patch("/service", Authenticate, UpdateVandorService);

router.post("/food", images, Authenticate, AddFood);
router.get("/foods", Authenticate, GetFood);


///Orders

router.get("/orders", Authenticate, GetCurrentOrders);
router.put("/order/:id/process", Authenticate, ProcessOrder);;
router.get("/order/:id", Authenticate, GetOrderDetails);


//Offers

router.post("offer", Authenticate, AddOffer);
router.put("offer/:id", Authenticate, EditOffer);
router.get("offers", Authenticate, GetOffers);


router.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.json("Hello VandorRouter");
});


export { router as VandorRoute };
