import { NextResponse } from "next/server";

// Short links are generated client-side and resolved by /s/[code]/route.ts
export function GET() {
  return NextResponse.json({ error: "Use /s/<code> for short links" }, { status: 410 });
}
