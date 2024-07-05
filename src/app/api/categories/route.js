import { mongooseConnect } from "../../../../lib/mongoose";
import { NextResponse } from "next/server";
import { Category } from "../../../../models/category";
import { isAdminRequest } from "../../../../lib/options";

export async function GET(req) {
  try {
    const isAdmin = await isAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to access this resource" },
        { status: 403 }
      );
    }
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
    const { name, parentCategory, properties } = await req.json();
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties: properties || undefined,
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
    const { _id, name, parentCategory, properties } = await req.json();
    let updateData = { name, properties };
    if (parentCategory) {
      updateData.parent = parentCategory;
    } else {
      updateData = { ...updateData, $unset: { parent: "" } };
    }
    const categoryDoc = await Category.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
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
