import { NextResponse } from "next/server";
import { analyzeCodeRepo } from "@/lib/repoAi";

export async function POST(req: Request) {
  const { structure, file } = await req.json();
  console.log("1 Received request with structure:", structure);
  console.log("1 Received request with file:", file);

  if (!structure || !file) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await analyzeCodeRepo(structure, file);

  return NextResponse.json({ result });
}
