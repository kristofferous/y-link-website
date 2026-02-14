"use server";

import { notFound, redirect } from "next/navigation";
import { clearSessionCookie, setSessionCookie } from "@/lib/session";
import { getAdminLoginToken, validateAdminCredentials } from "@/lib/adminAccess";

type AdminActionState = { status: "idle" | "error"; message?: string };

function normalize(value: string | null) {
  return (value ?? "").trim();
}

export async function adminLoginAction(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const email = normalize(formData.get("email") as string).toLowerCase();
  const password = normalize(formData.get("password") as string);
  const locale = normalize(formData.get("locale") as string) || "en";
  const tokenFromForm = normalize(formData.get("token") as string);
  const loginToken = getAdminLoginToken();

  if (!loginToken || tokenFromForm !== loginToken) {
    notFound();
  }

  const result = await validateAdminCredentials(email, password);
  if (!result.ok) {
    return { status: "error", message: "Invalid credentials or insufficient access." };
  }

  await clearSessionCookie();
  await setSessionCookie(result.email, null, "admin");
  redirect(`/${locale}/admin`);
}

export async function adminLogoutAction(formData?: FormData) {
  await clearSessionCookie();
  const locale = normalize(formData?.get("locale") as string) || "en";
  const loginToken = getAdminLoginToken();
  if (!loginToken) {
    redirect(`/${locale}`);
  }
  redirect(`/${locale}/gate/${loginToken}`);
}
