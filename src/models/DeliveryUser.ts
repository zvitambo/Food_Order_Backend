import mongoose, { Schema, Document, Model } from "mongoose";
import { OrderDoc } from "../models";

interface DeliveryUserDoc extends Document {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  pincode: string;
  password: string;
  email: string;
  salt: string;
  verified: boolean;
  lat: number;
  lng: number;
  isAvailable: boolean;
}

const DeliveryUserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    pincode: { type: String },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    salt: { type: String, required: true },
    verified: { type: Boolean, required: true },
    lat: { type: Number },
    lng: { type: Number },
    isAvailable: { type: Boolean },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const DeliveryUser = mongoose.model<DeliveryUserDoc>(
  "DeliveryUser",
  DeliveryUserSchema
);

export { DeliveryUser };
