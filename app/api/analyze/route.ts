import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { NextResponse } from "next/server";
import crypto from 'crypto';
import clientPromise from "../../../lib/mongodb"; 

function generateForensicHash(data: any) {
  const secretSalt = "PHANTOM_LEDGER_X_SECURE_2026";
  const dataString = JSON.stringify(data) + secretSalt;
  return crypto.createHash('sha256').update(dataString).digest('hex');
}

const cleanJSON = (text: string) => text.replace(/```json|```/g, "").trim();

export async function POST(req: Request) {
  try {
    const { logData } = await req.json();
    const geminiKey = process.env.GEMINI_API_KEY;
    const cerebrasKey = process.env.CEREBRAS_API_KEY;

    // --- AI ANALYSIS ---
    let fastData = { type: "Suspicious", risk: "50%" };
    try {
      const cerebras = new Cerebras({ apiKey: cerebrasKey || "" });
      const resp = await cerebras.chat.completions.create({
        messages: [{ role: 'user', content: `Analyze: ${logData}. JSON: {"type": "name", "risk": "0-100%"}` }],
        model: 'llama3.1-8b',
        temperature: 0
      });
      fastData = JSON.parse(cleanJSON(resp.choices[0].message.content || "{}"));
    } catch (e) { console.error("AI 1 Fail"); }

    let deepData = { behavior: "Analysis pending", pattern: "Undetected", score: "Low" };
    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const genResponse = await fetch(url, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Analyze intent: "${logData}". JSON: {"behavior": "string", "pattern": "string", "score": "High/Med/Low"}` }] }],
            generationConfig: { temperature: 0 }
          })
        });
        const resJson = await genResponse.json();
        if (resJson.candidates) deepData = JSON.parse(cleanJSON(resJson.candidates[0].content.parts[0].text));
      } catch (e) { console.error("AI 2 Fail"); }
    }

    const report = {
      ...fastData, ...deepData,
      timestamp: new Date().toISOString()
    };
    const evidenceHash = generateForensicHash(report);

    // --- THE TRAP: PERSIST TO MONGODB ---
    try {
      const client = await clientPromise;
      const db = client.db("PhantomLedger");
      const result = await db.collection("threats").insertOne({
        ...report,
        hash: `0x${evidenceHash}`,
        raw_input: logData
      });
      
      // THIS IS WHAT YOU WANT TO SEE IN TERMINAL:
      console.log("✅ TRAP SPRUNG: Data saved with ID:", result.insertedId);
    } catch (dbError: any) {
      console.error("❌ TRAP FAILED:", dbError.message);
    }

    return NextResponse.json({ ...report, hash: `0x${evidenceHash}` });

  } catch (err: any) {
    return NextResponse.json({ error: "System Error" }, { status: 500 });
  }
}