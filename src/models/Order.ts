import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
  orderID: number; //37388922
  vandorId: string;
  items: [any]; // [{food , unit: 5}]
  totalAmount: number;
  orderDate: Date;
  paidThrough: string; //credit card, cash etc
  paymentResponse: string; // {status: ok, response: some bank response}
  orderStatus: string; // cancelled, delivered
  deliveryId: string;
  appliedOffers: boolean;
  offerId: string;
  remarks: string;
  readyTime: number;
}

const OrderSchema = new mongoose.Schema(
  {
    orderID: { type: String, required: true },
    vandorId: { type: String, required: true },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "Food", required: true },
        unit: { type: String, required: true },
      },
    ],
    totalAmount: { type: String, required: true },
    orderDate: { type: String, required: true },
    paidThrough: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String },
    deliveryId: { type: String },
    appliedOffers: { type: Boolean },
    offerId: { type: String },
    remarks: { type: String },
    readyTime: { type: Number },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Order = mongoose.model<OrderDoc>("Order", OrderSchema);

export { Order };
