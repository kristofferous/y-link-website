"use server";

import { redirect } from "next/navigation";
import { validateInviteAndPilot } from "@/lib/pilotAccess";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";

type ActionState = { status: "idle" | "error"; message?: string };

function normalize(value: string | null) {
  return (value ?? "").trim();
}

export async function accessAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = normalize(formData.get("email") as string).toLowerCase();
  const code = normalize(formData.get("code") as string);
  const redirectTo = normalize((formData.get("redirectTo") as string) ?? "") || "/studio/download";

  if (!email || !code) {
    return { status: "error", message: "Invalid invite or access not approved" };
  }

  const result = await validateInviteAndPilot(email, code);
  if (!result.ok) {
    return { status: "error", message: "Invalid invite or access not approved" };
  }

  await clearSessionCookie();
  await setSessionCookie(email, result.pilotType);
  return redirect(redirectTo);
}

export async function logoutAction(formData?: FormData) {
  await clearSessionCookie();
  const localeValue = formData?.get("locale");
  const locale = normalize(localeValue as string) || "nb";
  redirect(`/${locale}/access`);
}
