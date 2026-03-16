import { NextResponse } from "next/server";
import User from "@/Models/User";
import connectDB from "@/lib/db";

export async function POST(req: Request) {

  const { user } = await req.json();
  console.log("Received request for history with user:", user);

  if (!user) {
    return NextResponse.json(
      { error: "No user provided" },
      { status: 400 }
    );
  }

  try {

    await connectDB();

    const userData = await User.findOne({ email: user }).lean();

    console.log("User data fetched:", userData);

    const history = userData?.history || [];

    console.log("Fetched history:", history);

    return NextResponse.json({ history });

  } catch (err) {

    console.error("Error fetching history:", err);

    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}