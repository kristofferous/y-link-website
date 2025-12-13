import { NextResponse } from "next/server";
import { validatePilotAccessByEmail } from "@/lib/pilotAccess";
import { getSessionFromCookie } from "@/lib/session";

export async function GET() {
  const session = await getSessionFromCookie();
  if (!session || !session.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pilot = await validatePilotAccessByEmail(session.email);
  if (!pilot.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = "Dette er en placeholder for Y-Link Studio. Kontakt Y-Link for full build.";
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": 'attachment; filename="y-link-studio.txt"',
      "Cache-Control": "no-store",
    },
  });
}
