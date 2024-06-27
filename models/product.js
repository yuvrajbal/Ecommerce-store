import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  category: { type: Schema.Types.ObjectId, ref: "Category" },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export { Product };
