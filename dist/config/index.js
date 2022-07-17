"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.APP_SECRET = exports.MONGO_URI = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.MONGO_URI = process.env.MONGO_URI || "";
exports.APP_SECRET = process.env.APP_SECRET || "";
exports.PORT = process.env.PORT || 3000;
//# sourceMappingURL=index.js.map