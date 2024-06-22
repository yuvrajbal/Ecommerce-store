// import { model, Schema } from "mongoose";

// const ProductSchema = new Schema({
//   title: { type: String, required: true },
//   description: String,
//   price: { type: Number, required: true },
// });
// export const Product = model("Product", ProductSchema);
import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export { Product };
