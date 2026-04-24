import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Group from "@/models/Group";

// GET: Fetch basic group details by invite code (public)
export async function GET(req: NextRequest, context: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await context.params;
    await connectToDatabase();
    
    // We only select safe fields for public viewing
    const group = await Group.findOne({ inviteCode: code })
      .populate("createdBy", "name")
      .select("name members createdBy");

    if (!group) {
      return NextResponse.json({ error: "Invalid or expired invite code." }, { status: 404 });
    }

    return NextResponse.json({
      name: group.name,
      memberCount: group.members.length,
      createdBy: (group.createdBy as any).name,
      groupId: group._id,
    });
  } catch (error) {
    console.error("Invite GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Join the group using the invite code (requires auth)
export async function POST(req: NextRequest, context: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to join." }, { status: 401 });
    }

    await connectToDatabase();
    
    const group = await Group.findOne({ inviteCode: code });

    if (!group) {
      return NextResponse.json({ error: "Invalid or expired invite code." }, { status: 404 });
    }

    const userId = (session.user as any).id;

    // Check if user is already a member
    if (group.members.includes(userId)) {
      return NextResponse.json({ error: "You are already a member of this group." }, { status: 400 });
    }

    // Add user to group
    group.members.push(userId);
    await group.save();

    return NextResponse.json({ message: "Successfully joined the group!", groupId: group._id }, { status: 200 });
  } catch (error) {
    console.error("Invite POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
