import { RequestHandler } from "express";
import { Vandor, FoodDoc } from "../models";



export const GetFoodAvailibilty : RequestHandler = async(req, res, next) => {

    const pincode = req.params.pincode;

    const result = await Vandor.find({ pincode: pincode, serviceAvailable: true})
    //.sort([["rating", "descending"]])
    .populate("foods");

    if (result.length > 0 ) return res.status(200).json(result);
    return res.status(400).json({message: "data not found"});

}

export const GetTopRestaurants: RequestHandler = async (req, res, next) => {
    const pincode = req.params.pincode;

    const result = await Vandor.find({
      pincode: pincode,
      serviceAvailable: true,
    })
     // .sort([["rating", "descending"]])
      .limit(1);

    if (result.length > 0) return res.status(200).json(result);
    return res.status(400).json({ message: "data not found" });
};

export const GetFoodsInThirtyMins: RequestHandler = async (req, res, next) => {
     const pincode = req.params.pincode;
     const limit: number = +req.query.limit!;

     const result = await Vandor.find({
       pincode: pincode,
       serviceAvailable: true,
     }).populate("foods");

     if (result.length > 0) {
       let filteredFoods: any[] = [];

       result.map((vandor) => {
         const foods = vandor.foods as [FoodDoc];
         filteredFoods.push(...foods.filter((food) => food.readyTime <= limit));
       });
       return res.status(200).json(filteredFoods);
     }
     return res.status(400).json({ message: "data not found" });
};

export const SearchFoods: RequestHandler = async (req, res, next) => {
        const pincode = req.params.pincode;

        const result = await Vandor.find({
          pincode: pincode,
          serviceAvailable: true,
        })
          .populate("foods");

        if (result.length > 0) {

            let filteredFoods: any[] = [];

            result.map( vandor => {
           
                filteredFoods.push(
                  ...vandor.foods
                );
                
            });
            return res.status(200).json(filteredFoods);
        } 
        return res.status(400).json({ message: "data not found" });
};

export const RestuarantById: RequestHandler = async (req, res, next) => {
    const restaurantId = req.params.id;
    const restaurant = await Vandor.findById(restaurantId).populate("foods")
    if(restaurant) return res.status(200).json(restaurant);
    return res.status(400).send({message: "Not Found"})
};