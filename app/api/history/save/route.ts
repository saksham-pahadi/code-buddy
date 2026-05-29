import { NextResponse } from "next/server";
import Reports from "@/Models/Reports";
import RepoReports from "@/Models/RepoReports";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const report = await req.json();

    if (!report?.email || !report?.id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();


console.log("Received report category for saving:", report.category);
    if (report.category === "repo") {
      // Check if report already exists
      const existing = await RepoReports.findOne({
        id: report.id,
        email: report.email,
      });

      if (existing) {
        // UPDATE
        await RepoReports.updateOne(
          { id: report.id, email: report.email },
          {
            $set: {
              code: report.code,
              github_id: report.github_id,
            repo_name: report.repo_name,
              title: report.response.title,
              response: report.response,
              category: report.category,
              saved: report.saved,
              updatedAt: new Date(),
              language: report.language,
            },
          },
        );
      } else {
        // CREATE
        const newReport = new RepoReports({
          email: report.email,
          username: report.email.split("@")[0],
          id: report.id,
          code: report.code,
          github_id: report.github_id,
            repo_name: report.repo_name,
          title: report.response.title,
          response: report.response,
          category: report.category,
          done: report.done,
          error: report.error,
          file: report.file,
          saved: report.saved,
          createdAt: new Date(),
          updatedAt: new Date(),
          language: report.language,
        });

        await newReport.save();
      }
      console.log("Report saved/updated successfully for email:", report.email, "id:", report.id ,"in GithubReports collection");
    }



    if (report.category === "cp" || report.category === "doc") {
      // Check if report already exists
      const existing = await Reports.findOne({
        id: report.id,
        email: report.email,
      });

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
              language: report.language,
            },
          },
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
          file: report.file,
          saved: report.saved,
          createdAt: new Date(),
          updatedAt: new Date(),
          language: report.language,
        });

        await newReport.save();
      }
      console.log("Report saved/updated successfully for email:", report.email, "id:", report.id ,"in Reports collection");
    }

    

    return NextResponse.json({ message: "Report saved successfully" });
  } catch (err) {
    console.error("Error saving report:", err);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 },
    );
  }
}
