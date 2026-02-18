import { NextResponse } from "next/server";
import { analyzeCode } from "@/lib/ai";

export async function POST(req: Request) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const result = await analyzeCode(code);

  return NextResponse.json({ result });
}
