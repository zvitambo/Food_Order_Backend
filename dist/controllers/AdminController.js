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
exports.GetVandorByID = exports.GetVandors = exports.CreateVandor = exports.FindVandor = void 0;
const PasswordUtility_1 = require("./../utility/PasswordUtility");
const models_1 = require("../models");
const FindVandor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email)
        return models_1.Vandor.findOne({ email: email });
    return models_1.Vandor.findById(id);
});
exports.FindVandor = FindVandor;
const CreateVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, foodType, pincode, address, phone, password, email } = req.body;
    const existingvandor = yield (0, exports.FindVandor)("", email);
    if (existingvandor !== null)
        return res.json('Vandor Exists Already');
    const salt = yield (0, PasswordUtility_1.GenerateSalt)();
    const userPassword = yield (0, PasswordUtility_1.GeneratePassword)(password, salt);
    const createdVandor = yield models_1.Vandor.create({
        name: name,
        ownerName: ownerName,
        foodType: foodType,
        pincode: pincode,
        address: address,
        phone: phone,
        password: userPassword,
        email: email,
        salt: salt,
        serviceAvailable: false,
        coverImages: [],
        rating: 0,
        foods: []
    });
    res.status(201).json({ vandor: createdVandor });
});
exports.CreateVandor = CreateVandor;
const GetVandors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandors = yield models_1.Vandor.find();
    if (vandors)
        return res.json(vandors);
    return res.json({ "message": "No vandors found" });
});
exports.GetVandors = GetVandors;
const GetVandorByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const vandor = yield (0, exports.FindVandor)(id);
    if (vandor)
        return res.json(vandor);
    return res.json({ "message": "Vandor not found" });
});
exports.GetVandorByID = GetVandorByID;
//# sourceMappingURL=AdminController.js.map