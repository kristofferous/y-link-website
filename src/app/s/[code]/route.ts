import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  try {
    // Restore standard base64 from base64url
    const padded = code.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (padded.length % 4)) % 4;
    const base64 = padded + "=".repeat(padding);
    const decoded = decodeURIComponent(escape(Buffer.from(base64, "base64").toString("binary")));

    // Only allow internal paths (must start with /)
    if (!decoded.startsWith("/")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.redirect(new URL(decoded, request.url));
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
