import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("PhantomLedger");
    
    // This fetches the 10 most recent attacks from your 'threats' collection
    const threats = await db.collection("threats")
      .find({})
      .sort({ timestamp: -1 }) // Show newest first
      .limit(10)
      .toArray();

    return NextResponse.json(threats);
  } catch (e: any) {
    console.error("History Fetch Error:", e.message);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}