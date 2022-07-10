import { SearchFoods, RestuarantById, GetFoodsInThirtyMins, GetTopRestaurants, GetFoodAvailibilty } from './../controllers/ShoppingController';
import express from "express";


const router = express.Router();
router.get("/:pincode", GetFoodAvailibilty);
router.get("/top-restaurants/:pincode", GetTopRestaurants);
router.get("/food-in-30-min/:pincode", GetFoodsInThirtyMins);
router.get("/searchfoods/:pincode", SearchFoods);
router.get("/restaurant/:id", RestuarantById);


export {router as ShoppingRoute};