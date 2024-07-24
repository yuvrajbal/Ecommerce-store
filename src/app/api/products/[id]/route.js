import { NextResponse } from "next/server";
import { mongooseConnect } from "../../../../../lib/mongoose";
import { Product } from "../../../../../models/product";
import { isAdminRequest } from "../../../../../lib/options";
import { Category } from "../../../../../models/category";
export async function GET(req, { params }) {
  const isAdmin = await isAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      { error: "You are not authorized to access this resource" },
      { status: 403 }
    );
  }
  const { id } = params;

  try {
    await mongooseConnect();
    const product = await Product.findById(id);
    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occured while fetching the product yuvii" },
      { status: 500 }
    );
  }
}

// Named export for the PUT method
export async function PUT(req, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;
    // get product details from the request body
    const {
      title,
      description,
      overview,
      keyBenefits,
      suggestedUse,
      ingredients,
      warnings,
      price,
      images,
      categories,
      properties,
    } = await req.json();

    let updateData = {
      title,
      description,
      overview,
      keyBenefits,
      suggestedUse,
      ingredients,
      warnings,
      price,
      images,
      categories,
      properties,
    };

    const categoryValues = await Category.find({ _id: { $in: categories } });
    const categoryProperties = categoryValues.map(
      (category) => category.properties
    );
    updateData.categoryProperties = categoryProperties;

    const updateProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updateProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(updateProduct);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the product." },
      { status: 500 }
    );
  }
}

// Named export for the DELETE method
export async function DELETE(req, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while deleting the product." },
      { status: 500 }
    );
  }
}
