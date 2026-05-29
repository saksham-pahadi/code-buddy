import { NextResponse } from "next/server";
import Reports from "@/Models/Reports";
import RepoReports from "@/Models/RepoReports";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, id, saved, category } = await req.json();

    if (!email || !id || typeof saved !== "boolean" || !category) {
      return NextResponse.json(
        { error: "Email, id, saved(boolean), and category are required" },
        { status: 400 },
      );
    }

    await connectDB();
    if (category === "repo") {
      const updatedRepoReport = await RepoReports.findOneAndUpdate(
        { email, id },
        { saved },
        { new: true, returnDocument: "after" },
      );

      if (!updatedRepoReport) {
        return NextResponse.json(
          { error: "Repo report not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        message: saved
          ? "Repo report saved successfully"
          : "Repo report unsaved successfully",
        saved: updatedRepoReport.saved,
      });
    }

    const updated = await Reports.findOneAndUpdate(
      { email, id },
      { saved },
      { new: true, returnDocument: "after" },
    );

    if (!updated) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
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
      { status: 500 },
    );
  }
}
