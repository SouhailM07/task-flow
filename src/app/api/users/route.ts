import { NextRequest, NextResponse } from "next/server";
import connectMongoose from "@/lib/connectDB";
import User from "@/models/user.model";
import handleResponse from "@/lib/handleRespnose";

connectMongoose();

export async function GET(req: NextRequest) {
  try {
    const clerkId = req.nextUrl.searchParams.get("clerkId");
    if (!clerkId) {
      const users = await User.find({});
      return handleResponse(users, 200);
    }
    const user = await User.findOne({ clerkId });
    if (!user) {
      return handleResponse("User not found", 404);
    }
    return handleResponse(user, 200);
  } catch (error) {
    return handleResponse(error, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    let values = await req.json();
    const user = new User(values);
    await user.save();
    return handleResponse("new user was created", 201);
  } catch (error) {
    return handleResponse(error, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      return handleResponse("User not found", 404);
    }
    return handleResponse("User deleted", 200);
  } catch (error) {
    return handleResponse(error, 500);
  }
}
