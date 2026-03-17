import { NextResponse } from "next/server";
import Reports from "@/Models/Reports";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, id, saved } = await req.json();

    if (!email || !id || typeof saved !== "boolean") {
      return NextResponse.json(
        { error: "Email, id and saved(boolean) are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await Reports.findOneAndUpdate(
      { email, id },
      { saved },
      { new: true ,
        returnDocument: "after"
      }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: saved
        ? "Report saved successfully"
        : "Report unsaved successfully",
      saved: updated.saved,
    });

  } catch (err) {
    console.error("Error toggling save:", err);

    return NextResponse.json(
      { error: "Failed to toggle save" },
      { status: 500 }
    );
  }
}