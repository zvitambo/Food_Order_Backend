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
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const utility_1 = require("./../utility");
const dto_1 = require("./../dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const models_1 = require("../models");
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0)
        return res.status(400).json(inputErrors);
    const { email, phone, password } = customerInputs;
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, utility_1.GenerateOtp)();
    const existingCustomer = yield models_1.Customer.findOne({ email: email });
    if (existingCustomer)
        return res.status(400).json({ message: "Customer exists" });
    const result = yield models_1.Customer.create({
        firstName: "",
        lastName: "",
        address: "",
        phone: phone,
        password: userPassword,
        email: email,
        salt: salt,
        verified: false,
        otp: otp,
        otp_expiry: expiry,
        lat: 0,
        lng: 0,
    });
    if (result) {
        //send the otp to customer
        yield (0, utility_1.onRequestOtp)(otp, phone);
        //generate the signature 
        const signature = (0, utility_1.GenerateSignature)({ _id: result._id, email: result.email, verified: result.verified });
        return res
            .status(201)
            .json({
            signature: signature,
            email: result.email,
            verified: result.verified,
        });
    }
    return res.status(400).json({ message: "failed to signup" });
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(dto_1.UserLoginInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(loginInputs, {
        validationError: { target: true },
    });
    if (inputErrors.length > 0)
        return res.status(400).json(inputErrors);
    const { email, password } = loginInputs;
    const customer = yield models_1.Customer.findOne({ email: email });
    if (customer) {
        const validated = yield (0, utility_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validated) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified,
            });
            return res.status(201).json({
                signature: signature,
                email: customer.email,
                verified: customer.verified,
            });
        }
    }
    return res.status(400).json({ message: "failed to signup" });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer === null || customer === void 0 ? void 0 : customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = yield profile.save();
                const signature = (0, utility_1.GenerateSignature)({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                });
                return res.status(201).json({
                    signature: signature,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                });
            }
        }
    }
    return res.status(400).json({ message: "Error with otp validation" });
});
exports.CustomerVerify = CustomerVerify;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.GenerateOtp)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, utility_1.onRequestOtp)(profile.otp, profile.phone);
            return res.status(200).json({ message: "Otp sent to you registered number" });
        }
    }
    return res.status(400).json({ message: "Error with Otp request" });
});
exports.RequestOtp = RequestOtp;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json(profile);
        }
        return res
            .status(400)
            .json({ message: "Customer information not found" });
    }
    return res.status(400).json({ message: "Customer information not found" });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerProfileInputs, req.body);
    const profileInputErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: true } });
    if (profileInputErrors.length > 0)
        return res.status(400).json(profileInputErrors);
    const { firstname, lastname, address } = profileInputs;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstname;
            profile.lastName = lastname;
            profile.address = address;
            const result = yield profile.save();
            return res
                .status(200)
                .json(result);
        }
        return res.status(400).json({ message: "Failed to update customer profile" });
    }
    return res.status(400).json({ message: "Customer information not found" });
});
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerController.js.map