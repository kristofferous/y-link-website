import "server-only";

import { createPublicClient } from "@/lib/supabasePublic";
import { createServiceClient } from "@/lib/supabaseServer";

type AdminValidationResult =
  | { ok: true; email: string }
  | { ok: false; reason: "invalid-credentials" | "not-approved" | "not-admin" | "config-error" };

const DEFAULT_ADMIN_ROLES = new Set(["founder"]);

function resolveAllowedRoles() {
  const raw = (process.env.ADMIN_ALLOWED_ROLES ?? "").trim().toLowerCase();
  if (!raw) return DEFAULT_ADMIN_ROLES;
  const roles = raw
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
  return new Set(roles.length > 0 ? roles : Array.from(DEFAULT_ADMIN_ROLES));
}

export function getAdminLoginToken() {
  return (process.env.ADMIN_LOGIN_PATH_TOKEN ?? "").trim();
}

export async function validateAdminCredentials(emailRaw: string, password: string): Promise<AdminValidationResult> {
  const email = (emailRaw ?? "").trim().toLowerCase();
  if (!email || !password) {
    return { ok: false, reason: "invalid-credentials" };
  }

  let publicClient;
  let serviceClient;
  try {
    publicClient = createPublicClient();
    serviceClient = createServiceClient();
  } catch {
    return { ok: false, reason: "config-error" };
  }

  const { data: authData, error: authError } = await publicClient.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user?.id) {
    return { ok: false, reason: "invalid-credentials" };
  }

  await publicClient.auth.signOut();

  const { data: profile, error: profileError } = await serviceClient
    .from("users")
    .select("role, is_approved, email")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { ok: false, reason: "not-admin" };
  }

  if (!profile.is_approved) {
    return { ok: false, reason: "not-approved" };
  }

  const allowedRoles = resolveAllowedRoles();
  const role = (profile.role ?? "").trim().toLowerCase();
  if (!allowedRoles.has(role)) {
    return { ok: false, reason: "not-admin" };
  }

  return { ok: true, email: (profile.email ?? email).toLowerCase() };
}
