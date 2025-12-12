"use server";

import { randomUUID } from "crypto";

import { interestOptions, type InterestOption } from "@/lib/interest";
import { createServiceClient } from "@/lib/supabaseServer";

type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

function normalizeEmail(value: string | null): string {
  return (value ?? "").trim().toLowerCase();
}

function normalizeString(value: string | null): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeInterest(value: string | null): InterestOption | null {
  return interestOptions.find((option) => option === value) ?? null;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function subscribeAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      status: "error",
      message:
        "Tjenesten er ikke konfigurert. Sett SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const email = normalizeEmail(formData.get("email") as string | null);
  const name = normalizeString(formData.get("name") as string | null);
  const interest =
    normalizeInterest(formData.get("interest_type") as string | null) ??
    interestOptions[0];
  const role = normalizeString(formData.get("role") as string | null);
  const dmxSetup = normalizeString(formData.get("dmx_setup") as string | null);
  const notes = normalizeString(formData.get("notes") as string | null);
  const contextSource = normalizeString(
    formData.get("context_source") as string | null,
  );

  const utm_source = normalizeString(formData.get("utm_source") as string | null);
  const utm_medium = normalizeString(formData.get("utm_medium") as string | null);
  const utm_campaign = normalizeString(
    formData.get("utm_campaign") as string | null,
  );
  const utm_term = normalizeString(formData.get("utm_term") as string | null);
  const utm_content = normalizeString(formData.get("utm_content") as string | null);
  const referrer = normalizeString(formData.get("referrer") as string | null);
  const pathname = normalizeString(formData.get("pathname") as string | null);
  const timestamp = normalizeString(formData.get("timestamp") as string | null);

  if (!email || !isValidEmail(email)) {
    return {
      status: "error",
      message: "Legg inn en gyldig e-postadresse.",
    };
  }

  const trackingPayload = {
    contextSource,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer,
    pathname,
    timestamp,
  };

  const basePayload = {
    email,
    name,
    interest_type: interest,
    subscribed: true,
    unsubscribe_token: randomUUID(),
    role,
    dmx_setup: dmxSetup,
    notes,
    tracking_payload: trackingPayload,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer,
    pathname,
    captured_at: timestamp,
  };

  try {
    const supabase = createServiceClient();

    const { data: existing, error: fetchError } = await supabase
      .from("email_subscriptions")
      .select(
        "id, unsubscribe_token, subscribed, name, interest_type, email",
      )
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      console.error(fetchError);
      return {
        status: "error",
        message: "Kunne ikke lagre forespørselen nå. Prøv igjen senere.",
      };
    }

    const trackingAwareInsert = existing
      ? {
          name,
          interest_type: interest,
          subscribed: true,
          unsubscribe_token: existing.unsubscribe_token ?? randomUUID(),
          role,
          dmx_setup: dmxSetup,
          notes,
          tracking_payload: trackingPayload,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
          referrer,
          pathname,
          captured_at: timestamp,
        }
      : basePayload;

    if (!existing) {
      const { error: insertError } = await supabase
        .from("email_subscriptions")
        .insert(trackingAwareInsert);

      if (insertError) {
        console.error(insertError);
        // Retry without optional fields in case of column mismatches.
        const { error: fallbackError } = await supabase
          .from("email_subscriptions")
          .insert({
            email,
            name,
            interest_type: interest,
            subscribed: true,
            unsubscribe_token: randomUUID(),
          });

        if (fallbackError) {
          console.error(fallbackError);
          return {
            status: "error",
            message:
              "Kunne ikke lagre forespørselen nå. Prøv igjen senere.",
          };
        }
      }
    } else {
      const { error: updateError } = await supabase
        .from("email_subscriptions")
        .update(trackingAwareInsert)
        .eq("email", email);

      if (updateError) {
        console.error(updateError);
        // Retry minimal update to avoid losing signup.
        const { error: fallbackError } = await supabase
          .from("email_subscriptions")
          .update({
            name,
            interest_type: interest,
            subscribed: true,
            unsubscribe_token: existing.unsubscribe_token ?? randomUUID(),
          })
          .eq("email", email);

        if (fallbackError) {
          console.error(fallbackError);
          return {
            status: "error",
            message:
              "Kunne ikke oppdatere oppføringen. Prøv igjen eller kontakt oss.",
          };
        }
      }
    }

    return {
      status: "success",
      message: "Takk! Vi har registrert interessen din.",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Noe gikk galt. Prøv igjen senere.",
    };
  }
}

export type SubscriptionFormState = FormState;
