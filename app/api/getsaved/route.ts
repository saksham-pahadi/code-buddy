import { NextResponse } from "next/server";
import Reports from "@/Models/Reports";
import RepoReports from "@/Models/RepoReports";
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
    const repoSavedReports = await RepoReports.find({
      email: email,
      saved: true,
    })
      .select("id response category createdAt updatedAt saved language github_id repo_name")
      .sort({ updatedAt: -1 })
      .lean();

    const savedReports = await Reports.find({
      email: email,
      saved: true,
    })
      .select("id response category createdAt updatedAt saved language")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      history: savedReports,repoHistory: repoSavedReports
    });

  } catch (err) {
    console.error("Error fetching saved reports:", err);

    return NextResponse.json(
      { error: "Failed to fetch saved reports" },
      { status: 500 }
    );
  }
}