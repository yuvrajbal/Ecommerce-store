import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: "Category" },
});

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export { Category };
