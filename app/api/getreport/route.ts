import { NextResponse } from "next/server";
import Reports from "@/Models/Reports";
import connectDB from "@/lib/db";
import { error } from "console";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    console.log("Fetching report for in cp:", id);

    if (!id ) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const reports = await Reports.find({id })

    console.log("Fetched reports in cp:", reports);
    if (reports.length === 0) {
      return NextResponse.json(
        {error: "No previous report found" },
        { status: 200 }
      );
    }

    return NextResponse.json(reports[0] );

  } catch (err) {
    console.error("Error fetching history:", err);

    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}