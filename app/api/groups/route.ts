import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User"; // ensuring model is registered before populate
import { checkRateLimit } from "@/utils/rateLimit";

export async function GET(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip, 20, 60000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    await connectToDatabase();
    // Use select('-__v') to protect internal database versioning structure from leaking
    const groups = await Group.find()
      .select('-__v')
      .populate({ path: "members", select: "name email" })
      .sort({ createdAt: -1 });
    return NextResponse.json(groups);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch groups." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip, 20, 60000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    await connectToDatabase();
    
    let body;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON body provided." }, { status: 400 });
    }
    
    // Strict Validation
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json({ error: "Group name is required." }, { status: 400 });
    }
    if (!body.createdBy) {
      return NextResponse.json({ error: "createdBy (User ID) is required to create a group." }, { status: 400 });
    }

    const newGroup = await Group.create(body);
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/groups Error:", error.message);
    // Handle Mongoose Validation Errors
    if (error.name === 'ValidationError') {
       return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error. Could not create group." }, { status: 500 });
  }
}
