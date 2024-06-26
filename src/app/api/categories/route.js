import { mongooseConnect } from "../../../../lib/mongoose";
import { NextResponse } from "next/server";
import { Category } from "../../../../models/category";

export async function GET() {
  try {
    await mongooseConnect();
    const categories = await Category.find().populate("parent");
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching the categories." },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    await mongooseConnect();
    const { name, parentCategory } = await req.json();
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory,
    });
    return NextResponse.json(categoryDoc, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while creating the category." },
      { status: 500 }
    );
  }
}
