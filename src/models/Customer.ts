import mongoose, { Schema, Document, Model } from "mongoose";
import { OrderDoc } from '../models';

interface CustomerDoc extends Document {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  password: string;
  email: string;
  salt: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
  orders: [OrderDoc];
  cart: any;

}

const CustomerSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    salt: { type: String, required: true },
    verified: { type: Boolean, required: true },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    lat: { type: Number },
    lng: { type: Number },
    orders: [{ type: Schema.Types.ObjectId, ref: "Food" }],
    cart: [
      {
        food: { type: Schema.Types.ObjectId, ref: "Food", required: true },
        unit: { type: Number,  required: true },
      },
    ],
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

const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);

export { Customer };
