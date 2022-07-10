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
exports.GetFood = exports.AddFood = exports.UpdateVandorService = exports.updateVandorCoverImage = exports.UpdateVandorProfile = exports.GetVandorProfile = exports.VandorLogin = void 0;
const AdminController_1 = require("./AdminController");
const PasswordUtility_1 = require("./../utility/PasswordUtility");
const models_1 = require("../models");
const VandorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingvandor = yield (0, AdminController_1.FindVandor)("", email);
    if (!existingvandor)
        return res.json("Email or Password is invalid");
    const validCredentials = yield (0, PasswordUtility_1.ValidatePassword)(password, existingvandor.password, existingvandor.salt);
    if (validCredentials) {
        const signature = (0, PasswordUtility_1.GenerateSignature)({
            _id: existingvandor.id,
            name: existingvandor.name,
            foodTypes: existingvandor.foodType,
            email: existingvandor.email
        });
        return res.status(200).json(signature);
    }
    return res.json("Email or Password is invalid");
});
exports.VandorLogin = VandorLogin;
const GetVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.FindVandor)(user._id);
        return res.json(existingVandor);
    }
    return res.json({ "message": "vandor information not found" });
});
exports.GetVandorProfile = GetVandorProfile;
const UpdateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, phone, name, foodType } = req.body;
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.FindVandor)(user._id);
        if (existingVandor) {
            existingVandor.phone = phone;
            existingVandor.name = name;
            existingVandor.address = address;
            existingVandor.foodType = foodType;
            const updatedVandor = yield existingVandor.save();
            return res.json(updatedVandor);
        }
    }
    return res.json({ message: "vandor information not found" });
});
exports.UpdateVandorProfile = UpdateVandorProfile;
const updateVandorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vandor = yield (0, AdminController_1.FindVandor)(user._id);
        if (vandor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vandor.coverImages.push(...images);
            const result = yield vandor.save();
            return res.status(201).json(result);
        }
    }
    return res.json({ message: "failed to add cover image" });
});
exports.updateVandorCoverImage = updateVandorCoverImage;
const UpdateVandorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.FindVandor)(user._id);
        if (existingVandor) {
            existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
            const updatedVandor = yield existingVandor.save();
            return res.json(updatedVandor);
        }
    }
    return res.json({ "message": "vandor information not found" });
});
exports.UpdateVandorService = UpdateVandorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, foodType, category, readyTime, price, } = req.body;
        const vandor = yield (0, AdminController_1.FindVandor)(user._id);
        if (vandor !== null) {
            const files = req.files;
            console.log("files - ", files);
            const images = files.map((file) => file.filename);
            console.log("images - ", images);
            const createdFood = yield models_1.Food.create({
                vandorId: vandor._id,
                name: name,
                description: description,
                foodType: foodType,
                category: category,
                readyTime: readyTime,
                price: price,
                rating: 0,
                images: images,
            });
            vandor.foods.push(createdFood);
            const result = yield vandor.save();
            return res.status(201).json(result);
        }
    }
    return res.json({ message: "failed to add food " });
});
exports.AddFood = AddFood;
const GetFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vandorId: user._id });
        if (foods)
            return res.status(200).json(foods);
    }
    return res.json({ message: "failed to get food listing " });
});
exports.GetFood = GetFood;
//# sourceMappingURL=VandorController.js.map