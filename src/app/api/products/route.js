import { Product } from "../../../../models/product";
import { mongooseConnect } from "../../../../lib/mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await mongooseConnect();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occured while fetching the products" },
      { status: 500 }
    );
  }
}

// Named export for the POST method
export async function POST(req) {
  try {
    // Connect to MongoDB
    await mongooseConnect();

    // Parse the request body
    const { title, description, price, images, category } = await req.json();

    // Create a new product document in the database
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
    });

    // Respond with the created product document
    return NextResponse.json(productDoc, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while creating the product." },
      { status: 500 }
    );
  }
}

// Named export for the PUT method
export async function PUT(req, { params }) {
  try {
    await mongooseConnect();
    const { id } = params;
    const { title, description, price, images, category } = await req.json();
    const updateProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, price, images, category },
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
