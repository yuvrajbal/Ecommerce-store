import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    overview: String,
    keyBenefits: [String],
    suggestedUse: { type: String },
    ingredients: String,
    warnings: String,
    price: { type: Number, required: true },
    images: [String],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    properties: { type: Object },
    categoryProperties: [{ type: Object }],
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export { Product };
