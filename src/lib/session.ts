import crypto from "crypto";
import { cookies } from "next/headers";

type SessionData = {
  email: string;
  pilotType?: string | null;
  role?: "pilot" | "admin";
  exp: number;
  iat: number;
};

const COOKIE_NAME = "pilot_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 timer

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return secret;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function encodeSession(data: SessionData) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function decodeSession(token: string): SessionData | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionData;
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export async function setSessionCookie(email: string, pilotType?: string | null, role: "pilot" | "admin" = "pilot") {
  const now = Date.now();
  const data: SessionData = {
    email,
    pilotType: pilotType ?? undefined,
    role,
    iat: now,
    exp: now + SESSION_TTL_MS,
  };
  const token = encodeSession(data);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
}

export async function getSessionFromCookie(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decodeSession(token);
}
