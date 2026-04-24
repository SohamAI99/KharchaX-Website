import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Group from "@/models/Group";
import Expense from "@/models/Expense";
import { checkRateLimit } from "@/utils/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    // Extreme rate limit for seed endpoint to prevent DB wipe spam
    if (!checkRateLimit(ip, 2, 60000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    await connectToDatabase();

    // 1. SAFETY MEASURE: Clear existing sample data to prevent duplicate clusters on multiple runs
    await User.deleteMany({});
    await Group.deleteMany({});
    await Expense.deleteMany({});

    // ... (rest of data seeding logic) ...
    
    // 2. Create Dummy Users
    const usersData = [
      { name: "Soham", email: "soham@kharchax.local" },
      { name: "Rahul", email: "rahul@kharchax.local" },
      { name: "Sneha", email: "sneha@kharchax.local" },
      { name: "Amit", email: "amit@kharchax.local" },
    ];
    
    const createdUsers = await User.insertMany(usersData);
    
    // Quick reference map for IDs
    const sohamId = createdUsers[0]._id;
    const rahulId = createdUsers[1]._id;
    const snehaId = createdUsers[2]._id;
    const amitId = createdUsers[3]._id;

    // 3. Create Dummy Group
    const newGroup = await Group.create({
      name: "Goa Trip 2026",
      mode: "Trip",
      members: [sohamId, rahulId, snehaId, amitId],
      createdBy: sohamId, // Soham created the group
      budget: 50000
    });

    // 4. Create Sample Expenses
    // We will split everything equally among all 4 members for simplicity in the seed.
    const splitEqually = [
      { user: sohamId, amountOwed: 5000 },
      { user: rahulId, amountOwed: 5000 },
      { user: snehaId, amountOwed: 5000 },
      { user: amitId, amountOwed: 5000 },
    ];

    const expense1 = await Expense.create({
      groupId: newGroup._id,
      title: "Flights to Goa",
      amount: 20000,
      paidBy: rahulId, // Rahul paid for flights
      splitAmong: splitEqually,
    });

    const expense2 = await Expense.create({
      groupId: newGroup._id,
      title: "Villa Advance",
      amount: 8000,
      paidBy: snehaId, // Sneha paid for the villa
      splitAmong: [
        { user: sohamId, amountOwed: 2000 },
        { user: rahulId, amountOwed: 2000 },
        { user: snehaId, amountOwed: 2000 },
        { user: amitId, amountOwed: 2000 },
      ],
    });

    const expense3 = await Expense.create({
      groupId: newGroup._id,
      title: "Pre-trip Drinks",
      amount: 2200,
      paidBy: amitId, // Amit paid for drinks
      splitAmong: [
        { user: sohamId, amountOwed: 550 },
        { user: rahulId, amountOwed: 550 },
        { user: snehaId, amountOwed: 550 },
        { user: amitId, amountOwed: 550 },
      ],
    });

    return NextResponse.json({
      message: "Database Successfully Seeded!",
      data: {
        users: createdUsers,
        group: newGroup,
        expenses: [expense1, expense2, expense3]
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Seed failed due to internal error." }, { status: 500 });
  }
}
