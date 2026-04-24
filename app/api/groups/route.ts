import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User"; // ensuring model is registered before populate
import { checkRateLimit } from "@/utils/rateLimit";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip, 20, 60000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    await connectToDatabase();

    // Only return groups where the user is a member
    const groups = await Group.find({ members: userId })
      .select("-__v")
      .populate({ path: "members", select: "name email" })
      .sort({ createdAt: -1 });

    return NextResponse.json(groups);
  } catch (error: any) {
    console.error("GET /api/groups Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch groups." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip, 20, 60000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    await connectToDatabase();

    let body;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON body provided." }, { status: 400 });
    }

    // Strict Validation
    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json({ error: "Group name is required." }, { status: 400 });
    }

    // Validate userId is a valid ObjectId string before casting
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid session user ID." }, { status: 400 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Automatically assign createdBy and push creator into members array
    const newGroupData = {
      name: body.name.trim(),
      mode: body.mode || "Trip",
      budget: body.budget ? Number(body.budget) : undefined,
      createdBy: userObjectId,
      members: [userObjectId], // Creator is immediately a member
    };

    const newGroup = await Group.create(newGroupData);
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/groups Error:", error.message, error.stack);
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error. Could not create group." }, { status: 500 });
  }
}
