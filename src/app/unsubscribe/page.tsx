import { randomUUID } from "crypto";

import { createServiceClient } from "@/lib/supabaseServer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageShell } from "@/components/PageShell";
import { SectionCard } from "@/components/SectionCard";

export const metadata = {
  title: "Avmelding | Y-Link",
  description: "Avmeld deg fra Y-Link-oppdateringer.",
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
      message: "Du er nå avmeldt e-postlisten.",
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
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Avmelding
          </p>
          <h1 className="text-3xl font-semibold">E-postpreferanser</h1>
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

        <p className="text-sm text-neutral-600">
          Hvis du avmeldte ved en feil, kan du registrere interessen på nytt via hovedsiden.
        </p>
      </SectionCard>
    </PageShell>
  );
}
