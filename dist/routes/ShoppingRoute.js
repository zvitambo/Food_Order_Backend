"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const ShoppingController_1 = require("./../controllers/ShoppingController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.ShoppingRoute = router;
router.get("/:pincode", ShoppingController_1.GetFoodAvailibilty);
router.get("/top-restaurants/:pincode", ShoppingController_1.GetTopRestaurants);
router.get("/food-in-30-min/:pincode", ShoppingController_1.GetFoodsInThirtyMins);
router.get("/searchfoods/:pincode", ShoppingController_1.SearchFoods);
router.get("/restaurant/:id", ShoppingController_1.RestuarantById);
//# sourceMappingURL=ShoppingRoute.js.map