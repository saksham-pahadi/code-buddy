import { NextResponse } from "next/server";
import Reports from "@/Models/Reports";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    console.log("Fetching history for:", email);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const reports = await Reports.find({ email })
      .select("id response category createdAt saved")
      .sort({ createdAt: -1 }) // latest first
      .lean();

    console.log("Fetched reports in history:", reports);

    return NextResponse.json({ history: reports });

  } catch (err) {
    console.error("Error fetching history:", err);

    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}