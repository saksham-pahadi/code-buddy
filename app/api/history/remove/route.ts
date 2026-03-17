import { NextResponse } from "next/server";
import Reports from "@/Models/Reports";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, id } = await req.json();

    if (!email || !id) {
      return NextResponse.json(
        { error: "Email and id are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const deleted = await Reports.findOneAndDelete({
      email: email,
      id: id,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "History item removed successfully",
    });

  } catch (err) {
    console.error("Error removing history:", err);

    return NextResponse.json(
      { error: "Failed to remove history" },
      { status: 500 }
    );
  }
}