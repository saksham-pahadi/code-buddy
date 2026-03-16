import { NextResponse } from "next/server";
import Reports from "@/Models/Reports";

import User from "@/Models/User";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: Request) {
    const report = await req.json();
    console.log("Received report:", report);
    if (!report) {
        return NextResponse.json({ error: "No report provided" }, { status: 400 });
    }
    try {
        await connectDB();
        const newReport = new Reports({
            email: report.email,
            username: report.email.split("@")[0],
            id: report.id,
            response: {
                title: report.response.title,
                code_explaination: report.response.code_explaination,
                time_complexity: report.response.time_complexity,
                space_complexity: report.response.space_complexity,
                "Bug&Error": report.response["Bug&Error"],
                optimization: report.response.optimization,
                scores: {
                    maintainability: report.response.scores.maintainability,
                    readability: report.response.scores.readability,
                    performance: report.response.scores.performance,
                    security: report.response.scores.security,
                },
            },
            done: report.done,
            error: report.error,
            createdAt: report.date,
            updatedAt: report.date,
            saved: report.saved,

        });
        await newReport.save();
        // Update user's history
        await User.findOneAndUpdate(
            { email: report.email },
            { $push: { history: { id: report.id, title: report.response.title, date: report.date, saved: report.saved } } },
           {  upsert: true,returnDocument: "after" }
        );

    } catch (err) {
        console.error("Error saving report:", err);
        return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
    }
    // Save report to database
    return NextResponse.json({ message: "Report saved successfully" });
  
}