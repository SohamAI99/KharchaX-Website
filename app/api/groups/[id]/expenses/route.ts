import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Expense from "@/models/Expense";
import User from "@/models/User";
import { checkRateLimit } from "@/utils/rateLimit";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip, 30, 60000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    await connectToDatabase();
    const { id } = await context.params;

    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid Group ID format." }, { status: 400 });
    }

    const expenses = await Expense.find({ groupId: id })
      .select('-__v')
      .populate("paidBy", "name")
      .populate("splitAmong.user", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch expenses." }, { status: 500 });
  }
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip, 30, 60000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    await connectToDatabase();
    const { id } = await context.params;
    
    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid Group ID format." }, { status: 400 });
    }

    let body;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON body provided." }, { status: 400 });
    }
    
    // Strict Validation
    if (!body.title || !body.amount || !body.paidBy || !body.splitAmong || !Array.isArray(body.splitAmong)) {
      return NextResponse.json({ error: "Missing required fields (title, amount, paidBy, splitAmong)." }, { status: 400 });
    }
    
    const newExpense = await Expense.create({
      ...body,
      groupId: id
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error: any) {
    console.error(`POST /api/groups/[id]/expenses Error:`, error.message);
    if (error.name === 'ValidationError') {
       return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error. Could not create expense." }, { status: 500 });
  }
}
