"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const controllers_1 = require("./../controllers");
const middlewares_1 = require("./../middlewares");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.CustomerRoute = router;
router.post("/signup", controllers_1.CustomerSignUp);
router.post("/login", controllers_1.CustomerLogin);
// Authenticate
router.use(middlewares_1.Authenticate);
router.patch("/verify", controllers_1.CustomerVerify);
router.get("/otp", controllers_1.RequestOtp);
router.get("/profile", controllers_1.GetCustomerProfile);
router.patch("/profile", controllers_1.EditCustomerProfile);
//Cart
router.post('/cart', controllers_1.AddToCart);
router.get("/cart", controllers_1.GetCart);
router.delete("/cart", controllers_1.DeleteCart);
//Payment
//Order
router.post("/create-order", controllers_1.CreateOrder);
router.get("/order", controllers_1.GetOrders);
router.get("/order/:id", controllers_1.GetOrderById);
//# sourceMappingURL=CustomerRoute.js.map