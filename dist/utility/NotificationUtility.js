"use strict";
//Email
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
exports.onRequestOtp = exports.GenerateOtp = void 0;
//Notification
//Otp
const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 90000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.GenerateOtp = GenerateOtp;
const onRequestOtp = (otp, toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSId = "ACe160499b5ec8579f2b4ebbdcfdff1e2e";
    const authToken = "f7e5458a850f6843d6392d34c69e3f18";
    const client = require("twilio")(accountSId, authToken);
    const response = yield client.messages.create({
        body: `Thomas Jindu says Your OTP is ${otp}`,
        from: "+19036086542",
        to: `+263${toPhoneNumber}`,
    });
    return response;
});
exports.onRequestOtp = onRequestOtp;
//# sourceMappingURL=NotificationUtility.js.map