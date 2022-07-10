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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ExpressApp_1 = __importDefault(require("./services/ExpressApp"));
const Database_1 = __importDefault(require("./services/Database"));
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    yield (0, Database_1.default)();
    yield (0, ExpressApp_1.default)(app);
    app.listen(3000, () => {
        console.log("Server started on port 3000");
    });
});
StartServer();
// import { MONGO_URI } from "./config";
// import express from "express";
// import mongoose from "mongoose";
// import { AdminRoute, VandorRoute } from "./routes";
// import bodyParser from "body-parser";
// import path from "path";
// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use("images", express.static(path.join(__dirname, "images")));
// app.use("/admin", AdminRoute);
// app.use("/vandor", VandorRoute);
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("Connected to Mongo DB"))
//   .catch(() => console.log("Database connection failed"));
// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });
//# sourceMappingURL=index.js.map