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
exports.GetOrderById = exports.GetOrders = exports.CreateOrder = exports.DeleteCart = exports.GetCart = exports.AddToCart = exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
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
        orders: []
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
//Cart
const AddToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id).populate("cart.food");
        let cartItems = Array();
        const { _id, unit } = req.body;
        const food = yield models_1.Food.findById(_id);
        if (food) {
            if (profile !== null) {
                // Check for cart items 
                cartItems = profile.cart;
                if (cartItems.length > 0) {
                    //check and update items 
                    let existingFoodItem = cartItems.filter(item => item.food._id.toString() === _id);
                    if (existingFoodItem.length > 0) {
                        const index = cartItems.indexOf(existingFoodItem[0]);
                        if (unit > 0) {
                            cartItems[index] = { food, unit };
                        }
                        else {
                            cartItems.splice(index, 1);
                        }
                    }
                    else {
                        cartItems.push({ food, unit });
                    }
                }
                else {
                    //add new itemn to cart
                    cartItems.push({ food, unit });
                }
                if (cartItems) {
                    profile.cart = cartItems;
                    const cartResult = yield profile.save();
                    return res.status(201).json(cartResult.cart);
                }
            }
        }
        return res
            .status(400)
            .json({ message: "Failed to update customer profile" });
    }
    return res.status(400).json({ message: "Customer information not found" });
});
exports.AddToCart = AddToCart;
const GetCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id).populate("cart.food");
        if (profile)
            return res.status(200).json(profile.cart);
        return res.status(400).json({ message: "Customer profile not found" });
    }
    return res.status(400).json({ message: "Customer information not found" });
});
exports.GetCart = GetCart;
const DeleteCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id).populate("cart.food");
        if (profile) {
            profile.cart = [];
            const profileResult = yield profile.save();
            return res.status(200).json(profileResult);
        }
        return res.status(400).json({ message: "Customer profile not found" });
    }
    return res.status(400).json({ message: "Customer information not found" });
});
exports.DeleteCart = DeleteCart;
//Order
const CreateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //grab current logined user
    const customer = req.user;
    if (customer) {
        //create an orderid 
        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
        const profile = yield models_1.Customer.findById(customer._id);
        //Grab order items from request [{_id: xx, units: xx}]
        const cart = req.body;
        let cartItems = Array();
        let netAmount = 0.0;
        const foods = yield models_1.Food.find().where('_id').in(cart.map(item => item._id)).exec();
        foods.map(food => {
            cart.map(({ _id, unit }) => {
                if (food._id = _id) {
                    netAmount += food.price * unit;
                    cartItems.push({ food, unit });
                }
            });
        });
        //Create Order with Order descriptions
        if (cartItems.length > 0) {
            const currentOrder = yield models_1.Order.create({
                orderID: orderId,
                items: cartItems,
                totalAmount: netAmount,
                orderDate: new Date(),
                paidThrough: 'COD',
                paymentResponse: '',
                orderStatus: 'Waiting',
            });
            if (currentOrder && profile) {
                profile === null || profile === void 0 ? void 0 : profile.orders.push(currentOrder);
                yield profile.save();
                return res.status(201).json(currentOrder);
            }
        }
    }
    return res.status(400).json({ message: "Customer information not found" });
});
exports.CreateOrder = CreateOrder;
const GetOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id).populate("orders");
        if (profile)
            return res.status(200).json(profile.orders);
        return res.status(400).json({ message: "Customer information not found" });
    }
    return res.status(400).json({ message: "Customer information not found" });
});
exports.GetOrders = GetOrders;
const GetOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const order = yield models_1.Order.findById(orderId).populate("items.food");
    if (order)
        return res.status(200).json(order);
    return res.status(400).json({ message: "Order information not found" });
});
exports.GetOrderById = GetOrderById;
//# sourceMappingURL=CustomerController.js.map