"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VandorRoute = void 0;
const controllers_1 = require("./../controllers");
const middlewares_1 = require("./../middlewares");
const controllers_2 = require("./../controllers");
const express_1 = __importDefault(require("express"));
const controllers_3 = require("../controllers");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VandorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname);
    },
});
const images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
router.post("/login", controllers_3.VandorLogin);
//router.use(Authenticate);
router.get("/profile", middlewares_1.Authenticate, controllers_2.GetVandorProfile);
router.patch("/profile", middlewares_1.Authenticate, controllers_2.UpdateVandorProfile);
router.patch("/coverimage", images, middlewares_1.Authenticate, controllers_2.updateVandorCoverImage);
router.patch("/service", middlewares_1.Authenticate, controllers_2.UpdateVandorService);
router.post("/food", images, middlewares_1.Authenticate, controllers_1.AddFood);
router.get("/foods", middlewares_1.Authenticate, controllers_1.GetFood);
///Orders
router.get("/orders", controllers_2.GetCurrentOrders);
router.put("/order/:id/process", controllers_2.ProcessOrder);
;
router.get("/order/:id", controllers_2.GetOrderDetails);
//Offers
router.post("offer", controllers_2.AddOffer);
router.put("offer/:id", controllers_2.EditOffer);
router.get("offers", controllers_2.GetOffers);
router.get("/", (req, res, next) => {
    return res.json("Hello VandorRouter");
});
//# sourceMappingURL=VandorRoute.js.map