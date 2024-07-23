import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    line_items: Object,
    email: String,
    name: String,
    zipcode: String,
    street: String,
    city: String,
    state: String,
    number: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
