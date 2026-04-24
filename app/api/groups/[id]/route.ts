import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    const group = await Group.findById(id).populate("members", "name email");
    
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    
    return NextResponse.json(group);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
