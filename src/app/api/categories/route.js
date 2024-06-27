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
export async function PUT(req) {
  try {
    await mongooseConnect();
    const { _id, name, parentCategory } = await req.json();
    const categoryDoc = await Category.findByIdAndUpdate(
      _id,
      { name, parent: parentCategory },
      { new: true }
    );
    return NextResponse.json(categoryDoc, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while updating the category." },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    await mongooseConnect();
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const deletedCategory = await Category.findByIdAndDelete(_id);
    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while deleting the category." },
      { status: 500 }
    );
  }
}
