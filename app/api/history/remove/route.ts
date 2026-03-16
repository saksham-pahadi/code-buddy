import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { user, id } = await req.json();
    if (!user) {
        return NextResponse.json({ error: "No user provided" }, { status: 400 });
    }
    // Remove history item from database based on id and user
    
    return NextResponse.json({ message: `History item with id ${id} removed for user ${user}` });
  
}