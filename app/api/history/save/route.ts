import { NextResponse } from "next/server";
import Reports from "@/Models/Reports";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const report = await req.json();
    console

    if (!report?.email || !report?.id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if report already exists
    const existing = await Reports.findOne({ id: report.id,email: report.email });

    if (existing) {
      // UPDATE
      await Reports.updateOne(
        { id: report.id, email: report.email },
        {
          $set: {
            code: report.code,
            title: report.response.title,
            response: report.response,
            category: report.category,
            saved: report.saved,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      // CREATE
      const newReport = new Reports({
        email: report.email,
        username: report.email.split("@")[0],
        id: report.id,
        code: report.code,
        title: report.response.title,
        response: report.response,
        category: report.category,
        done: report.done,
        error: report.error,
        saved: report.saved,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await newReport.save();
    }

    return NextResponse.json({ message: "Report saved successfully" });

  } catch (err) {
    console.error("Error saving report:", err);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}