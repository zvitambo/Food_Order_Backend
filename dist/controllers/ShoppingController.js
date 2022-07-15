"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestuarantById = exports.SearchFoods = exports.GetFoodsInThirtyMins = exports.GetTopRestaurants = exports.GetFoodAvailibilty = void 0;
const models_1 = require("../models");
const GetFoodAvailibilty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({ pincode: pincode, serviceAvailable: true })
        //.sort([["rating", "descending"]])
        .populate("foods");
    if (result.length > 0)
        return res.status(200).json(result);
    return res.status(400).json({ message: "data not found" });
});
exports.GetFoodAvailibilty = GetFoodAvailibilty;
const GetTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({
        pincode: pincode,
        serviceAvailable: true,
    })
        // .sort([["rating", "descending"]])
        .limit(1);
    if (result.length > 0)
        return res.status(200).json(result);
    return res.status(400).json({ message: "data not found" });
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetFoodsInThirtyMins = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const limit = +req.query.limit;
    const result = yield models_1.Vandor.find({
        pincode: pincode,
        serviceAvailable: true,
    }).populate("foods");
    if (result.length > 0) {
        let filteredFoods = [];
        result.map((vandor) => {
            const foods = vandor.foods;
            filteredFoods.push(...foods.filter((food) => food.readyTime <= limit));
        });
        return res.status(200).json(filteredFoods);
    }
    return res.status(400).json({ message: "data not found" });
});
exports.GetFoodsInThirtyMins = GetFoodsInThirtyMins;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({
        pincode: pincode,
        serviceAvailable: true,
    })
        .populate("foods");
    if (result.length > 0) {
        let filteredFoods = [];
        result.map(vandor => {
            filteredFoods.push(...vandor.foods);
        });
        return res.status(200).json(filteredFoods);
    }
    return res.status(400).json({ message: "data not found" });
});
exports.SearchFoods = SearchFoods;
const RestuarantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantId = req.params.id;
    const restaurant = yield models_1.Vandor.findById(restaurantId).populate("foods");
    if (restaurant)
        return res.status(200).json(restaurant);
    return res.status(400).send({ message: "Not Found" });
});
exports.RestuarantById = RestuarantById;
//# sourceMappingURL=ShoppingController.js.map