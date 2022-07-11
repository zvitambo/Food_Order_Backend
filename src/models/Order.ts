import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
    orderID: number; //37388922
    items: [any]; // [{food , unit: 5}]
    totalAmount: number;
    orderDate: Date;
    paidThrough: string; //credit card, cash etc
    paymentResponse: string; // {status: ok, response: some bank response}
    orderStatus: string ;
  
}

const OrderSchema = new mongoose.Schema(
  {
    orderID: { type: String, required: true },
    items: [
        {
        food: { type: Schema.Types.ObjectId, ref: "food", required: true },
        unit: { type: String, required: true }   
        }  
    ],
    totalAmount: { type: String, required: true },
    orderDate: { type: String, required: true },
    paidThrough: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String },
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
