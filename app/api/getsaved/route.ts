import { NextResponse } from "next/server";
import Reports from "@/Models/Reports";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const savedReports = await Reports.find({
      email: email,
      saved: true,
    })
      .select("id response category createdAt saved")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      history: savedReports,
    });

  } catch (err) {
    console.error("Error fetching saved reports:", err);

    return NextResponse.json(
      { error: "Failed to fetch saved reports" },
      { status: 500 }
    );
  }
}