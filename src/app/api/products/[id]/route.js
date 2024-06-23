import { NextResponse } from "next/server";
import { mongooseConnect } from "../../../../../lib/mongoose";
import { Product } from "../../../../../models/product";

export async function GET(req, { params }) {
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
    const { title, description, price } = await req.json();
    const updateProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, price },
      { new: true }
    );

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
