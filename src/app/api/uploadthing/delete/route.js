import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { Product } from "../../../../../models/product";
const utapi = new UTApi();

export async function POST(req) {
  const baseURL = "https://utfs.io/f/";
  const { key } = await req.json();
  const imageURL = baseURL + key;
  try {
    const res = await utapi.deleteFiles(key);

    const updatedProduct = await Product.findOneAndUpdate(
      { images: { $in: [imageURL] } },
      { $pull: { images: imageURL } },
      { new: true }
    );
    if (!updatedProduct) {
      throw new Error(
        "Product not found or image URL not in product's images array"
      );
    }
    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
    return NextResponse.error(
      { error: "An error occurred while deleting the image" },
      { status: 500 }
    );
  }
}
