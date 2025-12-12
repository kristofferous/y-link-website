import { randomUUID } from "crypto";
import type { Metadata } from "next";

import { createServiceClient } from "@/lib/supabaseServer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata: Metadata = {
  title: "Avmelding | Y-Link",
  description: "Meld deg av oppdateringer fra Y-Link.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/unsubscribe",
  },
};

type UnsubscribeResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string };

async function handleUnsubscribe(token: string | undefined): Promise<UnsubscribeResult> {
  if (!token) {
    return { status: "error", message: "Lenken er ikke gyldig." };
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("email_subscriptions")
      .update({
        subscribed: false,
        unsubscribe_token: randomUUID(),
      })
      .eq("unsubscribe_token", token)
      .select("email")
      .maybeSingle();

    if (error) {
      console.error(error);
      return {
        status: "error",
        message: "Noe gikk galt. Prøv igjen senere.",
      };
    }

    if (!data) {
      return {
        status: "error",
        message: "Lenken er utløpt eller allerede brukt.",
      };
    }

    return {
      status: "success",
      message: "Du er meldt av e-poster fra Y-Link.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Noe gikk galt. Prøv igjen senere.",
    };
  }
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tokenParam = searchParams.token;
  const token =
    typeof tokenParam === "string" ? tokenParam : Array.isArray(tokenParam) ? tokenParam[0] : undefined;

  const result = await handleUnsubscribe(token);

  return (
    <PageShell className="max-w-3xl">
      <Breadcrumbs items={[{ label: "Hjem", href: "/" }, { label: "Avmelding" }]} />
      <SectionCard className="space-y-6">
        <header className="space-y-2">
          <p className="label-text text-sm text-neutral-800">
            Avmelding
          </p>
          <h1 className="text-3xl font-bold text-neutral-950">E-postpreferanser</h1>
        </header>

        <div
          className={`rounded-2xl border px-6 py-5 text-base leading-7 ${
            result.status === "success"
              ? "border-emerald-200 bg-white text-neutral-800"
              : "border-red-200 bg-white text-neutral-800"
          }`}
        >
          {result.message}
        </div>

        <p className="text-sm text-neutral-800">
          Meldte du deg av ved en feil? Du kan registrere deg igjen på forsiden.
        </p>
      </SectionCard>
    </PageShell>
  );
}
