import { NextResponse } from "next/server";
import Reports from "@/Models/Reports";
import RepoReports from "@/Models/RepoReports";
import connectDB from "@/lib/db";
import { updateTag } from "next/cache";

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
      .select("id response category createdAt updatedAt saved language")
      .sort({ updatedAt: 1 }) 
      .lean();

    const repoReports = await RepoReports.find({ email })
      .select("id response category createdAt updatedAt saved language github_id repo_name")
      .sort({ updatedAt: 1 })
      .lean();

    console.log("Fetched reports in history:", reports);
    console.log("Fetched repo reports in history:", repoReports);

    return NextResponse.json({ history: [...reports, ...repoReports] });

  } catch (err) {
    console.error("Error fetching history:", err);

    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}