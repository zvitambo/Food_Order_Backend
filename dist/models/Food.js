"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Food = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FoodSchema = new mongoose_1.default.Schema({
    vandorId: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    foodType: { type: String, required: true },
    category: { type: String },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number },
    images: [{ type: String }],
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    },
    timestamps: true,
});
const Food = mongoose_1.default.model("Food", FoodSchema);
exports.Food = Food;
//# sourceMappingURL=Food.js.map