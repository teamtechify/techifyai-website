// app/api/plan/route.ts
import { NextResponse } from "next/server";

// Temporary in-memory storage (works for demo or dev only)
let latestPlanData: any = null;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Log or process incoming webhook data
    console.log("🔔 Webhook received:", body);

    // Store in memory or trigger downstream logic
    latestPlanData = body;

    // Respond success
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error handling webhook:", err);
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}

// Optional GET to retrieve latest webhook payload (for client polling)
export async function GET() {
  return NextResponse.json({ latestPlanData });
}
