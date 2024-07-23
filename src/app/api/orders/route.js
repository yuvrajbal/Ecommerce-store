import { mongooseConnect } from "../../../../lib/mongoose";
import { NextResponse } from "next/server";
import { isAdminRequest } from "../../../../lib/options";
import { Order } from "../../../../models/Order";

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
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching the orders." },
      { status: 500 }
    );
  }
}
