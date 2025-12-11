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

function normalizeName(value: string | null): string | null {
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
  const name = normalizeName(formData.get("name") as string | null);
  const interest = normalizeInterest(
    formData.get("interest_type") as string | null,
  );

  if (!email || !isValidEmail(email)) {
    return {
      status: "error",
      message: "Vennligst oppgi en gyldig e-postadresse.",
    };
  }

  if (!interest) {
    return {
      status: "error",
      message: "Velg hva slags interesse du har.",
    };
  }

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
        message: "Kunne ikke lagre interessen akkurat nå. Prøv igjen senere.",
      };
    }

    if (!existing) {
      const { error: insertError } = await supabase
        .from("email_subscriptions")
        .insert({
          email,
          name,
          interest_type: interest,
          subscribed: true,
          unsubscribe_token: randomUUID(),
        });

      if (insertError) {
        console.error(insertError);
        return {
          status: "error",
          message:
            "Kunne ikke lagre interessen akkurat nå. Prøv igjen senere.",
        };
      }
    } else {
      const { error: updateError } = await supabase
        .from("email_subscriptions")
        .update({
          name,
          interest_type: interest,
          subscribed: true,
          unsubscribe_token: existing.unsubscribe_token ?? randomUUID(),
        })
        .eq("email", email);

      if (updateError) {
        console.error(updateError);
        return {
          status: "error",
          message:
            "Kunne ikke oppdatere oppføringen. Prøv igjen eller kontakt oss.",
        };
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
