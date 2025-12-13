"use server";

import { createServiceClient } from "@/lib/supabaseServer";

type PilotStatus =
  | { ok: true; pilotType: string | null; expiresAt: string | null }
  | { ok: false; reason: string };

export async function validatePilotAccessByEmail(emailRaw: string): Promise<PilotStatus> {
  const email = (emailRaw ?? "").trim().toLowerCase();
  if (!email) {
    return { ok: false, reason: "missing-email" };
  }
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("pilot_users")
    .select("pilot_type, expires_at, is_active")
    .eq("email", email)
    .single();

  if (error || !data) {
    return { ok: false, reason: "not-found" };
  }
  if (!data.is_active) {
    return { ok: false, reason: "inactive" };
  }
  if (data.expires_at && new Date(data.expires_at).getTime() <= Date.now()) {
    return { ok: false, reason: "expired" };
  }

  return { ok: true, pilotType: data.pilot_type ?? null, expiresAt: data.expires_at ?? null };
}

export async function validateInviteAndPilot(emailRaw: string, codeRaw: string): Promise<
  | { ok: true; pilotType: string; expiresAt: string | null }
  | { ok: false; reason: "invalid" | "expired" | "exhausted" | "pilot-mismatch" | "conflict" }
> {
  const email = (emailRaw ?? "").trim().toLowerCase();
  const code = (codeRaw ?? "").trim();
  if (!email || !code) {
    return { ok: false, reason: "invalid" };
  }

  const supabase = createServiceClient();
  const { data: invite, error } = await supabase
    .from("invite_codes")
    .select("id, pilot_type, max_uses, used_count, expires_at")
    .eq("code", code)
    .maybeSingle();

  if (error || !invite) {
    return { ok: false, reason: "invalid" };
  }
  if (invite.expires_at && new Date(invite.expires_at).getTime() <= Date.now()) {
    return { ok: false, reason: "expired" };
  }
  if (invite.used_count >= invite.max_uses) {
    return { ok: false, reason: "exhausted" };
  }

  const { data: pilot, error: pilotError } = await supabase
    .from("pilot_users")
    .select("pilot_type, is_active, expires_at")
    .eq("email", email)
    .eq("pilot_type", invite.pilot_type)
    .maybeSingle();

  if (pilotError || !pilot) {
    return { ok: false, reason: "pilot-mismatch" };
  }
  if (!pilot.is_active) {
    return { ok: false, reason: "pilot-mismatch" };
  }
  if (pilot.expires_at && new Date(pilot.expires_at).getTime() <= Date.now()) {
    return { ok: false, reason: "pilot-mismatch" };
  }

  const { data: updated, error: updateError } = await supabase
    .from("invite_codes")
    .update({ used_count: invite.used_count + 1 })
    .eq("id", invite.id)
    .eq("used_count", invite.used_count)
    .select("id")
    .maybeSingle();

  if (updateError || !updated) {
    return { ok: false, reason: "conflict" };
  }

  return { ok: true, pilotType: pilot.pilot_type, expiresAt: pilot.expires_at ?? null };
}
